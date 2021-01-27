from books.views import apply_coupon, checkout_view, home_page_view
from django.urls import path

urlpatterns = [
    path('', home_page_view, name = 'home_view'),
    path('apply-coupon/', apply_coupon, name="apply_coupon"),
    path('checkout/', checkout_view, name="checkout"),
]
