from books.models import Book, Coupon
from django.shortcuts import redirect, render
from django.utils import timezone
from django.http import JsonResponse
import json
import razorpay

# Create your views here.
def home_page_view(request):
    book = Book.objects.latest('-published')

    if request.method == "POST":
        data = request.POST

        if data.get('razorpay_payment_id') != None:
            context = {
                'book': book,
                'payment_success' : True
            }
            return render(request, 'books/main.html', context)

    return render(request, 'books/main.html', {'book': book})

def apply_coupon(request):
    if request.method == "POST":
        data = json.loads(request.body.decode("utf-8"))
        coupon_code = data.get('coupon')
        now = timezone.now()
        try:
            coupon = Coupon.objects.get(code__iexact = coupon_code, active=True,  valid_from__lte=now, valid_to__gte=now)
            print(coupon)
            return JsonResponse({'discount': coupon.discount})
        except:
            return JsonResponse({'error': 'Invalid Coupon' })

def checkout_view(request):
    book = Book.objects.latest('-published')
    if request.method == "POST":
        data = request.POST
        
        context = {
            'book': book,
            'userdata': data
        }
        order_amount = 499
        coupon_code = data.get('coupon')
        now = timezone.now()
        try:
            coupon = Coupon.objects.get(code__iexact = coupon_code, active=True, valid_from__lte=now, valid_to__gte=now)
            context['coupon_code'] = coupon.code
            context['discount'] = coupon.discount
            order_amount = order_amount - int(coupon.discount)
            context['final_amount'] = order_amount
        except:
            pass

        
        order_currency = 'INR'

        #============================= ENTER YOUR RAZORPAY CREDENTIALS HERE=================================
        client = razorpay.Client(auth=('YOUR_KEY_ID', 'YOUR_KEY_SECRET'))
        #============================= ENTER YOUR RAZORPAY CREDENTIALS HERE=================================

        
        payment = client.order.create({
            'amount': order_amount*100,
            'currency': order_currency
        })

        context['payment'] = payment


        return render(request, 'books/checkout.html', context)
    return redirect('home_view')