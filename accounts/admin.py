from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .forms import UserAdminCreationForm, UserAdminChangeForm, AppCreationForm, AppChangeForm
from .models import TransparencyUser, TransparencyApp

class UserAdmin(BaseUserAdmin):
    form = UserAdminChangeForm
    add_form = UserAdminCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin that reference specific 
    # fields on auth.User.
    list_display = ('email', 'admin')
    list_filter = ('admin',)
    fieldsets = (
        ('Account', {'fields': ('email',)}),
        ('Profile', {'fields': ('first_name','last_name')}),
        ('Permissions', {'fields': ('admin','active','staff')}),
    )
    # These Are the Attributes to Use When Creating a New User 
    # for the Admin Form
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'email', 'first_name','last_name')}
        ),
    )
    search_fields = ('email','username')
    ordering = ('username',)
    filter_horizontal = ()


class AppAdmin(admin.ModelAdmin):
    form = AppChangeForm
    add_form = AppCreationForm
    fields = ('id', 'label', 'path_name','order','level','deprecated','live')
    list_display = ('app_name', 'path_name','order','level','deprecated','live')

    # Attempting to Adjust QuerySet So We Can Nest Apps
    def changelist_view(self, request, extra_context=None):
        response = super(AppAdmin, self).changelist_view(request, extra_context)

        qs = response.context_data["cl"].queryset
        apps = qs.all()
        for app in apps:
            app.children = [app]

        response.context_data["cl"].queryset = apps
        return response

    def get_queryset(self, request):
        qs = super(AppAdmin, self).get_queryset(request)
        return qs.filter(level=1)
        
    def app_name(self, obj):
        return obj.label
    app_name.short_description = 'Name'

admin.site.register(TransparencyUser, UserAdmin)
admin.site.register(TransparencyApp, AppAdmin)