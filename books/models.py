from django.db import models
from django.core.validators import FileExtensionValidator, MaxValueValidator, MinValueValidator

# Create your models here.
class Book(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(max_length=500)
    pic = models.ImageField(upload_to="books/",
                            default="books/kane_abel.jpeg",
                            validators = [FileExtensionValidator(['png', 'jpg', 'jpeg'])])
    price = models.IntegerField()
    published = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.published.strftime('%d-%m-%Y')}"

class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True)
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    discount = models.IntegerField(
        validators=[MinValueValidator(0),
                    MaxValueValidator(100)]
    )
    active = models.BooleanField()

    def __str__(self):
        return self.code