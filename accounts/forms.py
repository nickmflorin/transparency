from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField

from .models import TransparencyUser, TransparencyApp

class RegisterForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    password2 = forms.CharField(label='Confirm password', widget=forms.PasswordInput)

    class Meta:
        model = TransparencyUser
        fields = ('email','first_name','last_name')

    def clean_email(self):
        email = self.cleaned_data.get('email')
        qs = User.objects.filter(email=email)
        if qs.exists():
            raise forms.ValidationError("email is taken")
        return email

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2


class UserAdminCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = TransparencyUser
        fields = ('email','first_name','last_name')

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")

        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):

        user = super(UserAdminCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserAdminChangeForm(forms.ModelForm):
    #password = ReadOnlyPasswordHashField()
    email = forms.EmailField(label='Email')
    first_name = forms.CharField(label='First Name')
    last_name = forms.CharField(label='Last Name')
    
    class Meta:
        model = TransparencyUser
        fields = ('email', 'first_name', 'last_name', 'password', 'active', 'admin', 'apps')

    # Currently Not Using the Admin Change Form to Change Password
    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]


class AppCreationForm(forms.ModelForm):
    id = forms.CharField(label='ID', help_text='Unique and convenient identifier for app.')
    label = forms.CharField(label='Name', help_text='Formal name given to app.')
    path_name = forms.CharField(label='Path Name', help_text='Used to determine the url in conjunction with parent app.')

    class Meta:
        model = TransparencyApp
        fields = ('id','label','path_name','deprecated','live','children','order','level')
        
class AppChangeForm(forms.ModelForm):
    id = forms.CharField(label='ID', help_text='Unique and convenient identifier for app.')
    label = forms.CharField(label='Name', help_text='Formal name given to app.')
    path_name = forms.CharField(label='Path Name', help_text='Used to determine the url in conjunction with parent app.')

    class Meta:
        model = TransparencyApp
        fields = ('label','path_name','deprecated','live','children','order','level')




