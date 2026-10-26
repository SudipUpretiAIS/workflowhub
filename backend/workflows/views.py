from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .models import WorkflowItem
from .serializers import WorkflowItemSerializer


class WorkflowItemViewSet(ModelViewSet):
    serializer_class = WorkflowItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WorkflowItem.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)