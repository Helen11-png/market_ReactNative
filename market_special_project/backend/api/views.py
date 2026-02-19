from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def health_check(request):
    return Response({
        'status': 'ok',
        'message': 'Server is running',
        'api_version': '1.0'
    })


def test_view(request):
    return JsonResponse({'test': 'ok'})