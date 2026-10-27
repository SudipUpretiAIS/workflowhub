from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import WorkflowItem

User = get_user_model()


class WorkflowItemTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="StrongPass123!",
        )
        self.other_user = User.objects.create_user(
            username="otheruser",
            password="StrongPass123!",
        )
        self.client.force_authenticate(user=self.user)

    def test_user_can_create_update_and_delete_item(self):
        create_response = self.client.post(
            "/api/items/",
            {
                "title": "Complete assignment",
                "description": "Build and test WorkflowHub",
                "status": "Pending",
            },
            format="json",
        )

        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        item_id = create_response.data["id"]
        self.assertEqual(WorkflowItem.objects.get(id=item_id).owner, self.user)

        update_response = self.client.patch(
            f"/api/items/{item_id}/",
            {"status": "In Progress"},
            format="json",
        )

        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.data["status"], "In Progress")

        delete_response = self.client.delete(f"/api/items/{item_id}/")

        self.assertEqual(
            delete_response.status_code,
            status.HTTP_204_NO_CONTENT,
        )
        self.assertFalse(WorkflowItem.objects.filter(id=item_id).exists())

    def test_user_cannot_access_another_users_item(self):
        item = WorkflowItem.objects.create(
            owner=self.other_user,
            title="Private item",
            description="Belongs to another user",
        )

        response = self.client.get(f"/api/items/{item.id}/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_user_cannot_view_items(self):
        self.client.force_authenticate(user=None)

        response = self.client.get("/api/items/")

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )