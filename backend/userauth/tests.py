from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AuthenticationTests(APITestCase):
    def test_user_can_register(self):
        response = self.client.post(
            "/api/auth/register/",
            {"username": "testuser", "password": "StrongPass123!"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="testuser").exists())

        user = User.objects.get(username="testuser")
        self.assertTrue(user.check_password("StrongPass123!"))

    def test_user_can_login_and_logout(self):
        User.objects.create_user(
            username="testuser",
            password="StrongPass123!",
        )

        login_response = self.client.post(
            "/api/auth/login/",
            {"username": "testuser", "password": "StrongPass123!"},
            format="json",
        )

        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        token = login_response.data["token"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
        logout_response = self.client.post("/api/auth/logout/")

        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)

        second_logout = self.client.post("/api/auth/logout/")
        self.assertEqual(
            second_logout.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_login_rejects_wrong_password(self):
        User.objects.create_user(
            username="testuser",
            password="StrongPass123!",
        )

        response = self.client.post(
            "/api/auth/login/",
            {"username": "testuser", "password": "WrongPass123!"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)