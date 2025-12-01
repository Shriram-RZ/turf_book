package com.turfbook.backend.service;

import com.turfbook.backend.dto.response.NotificationResponse;
import com.turfbook.backend.model.Notification;
import com.turfbook.backend.model.enums.NotificationType;
import com.turfbook.backend.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getUserNotifications_ShouldReturnListOfNotificationResponses() {
        Long userId = 1L;
        Notification notification1 = new Notification();
        notification1.setId(1L);
        notification1.setUserId(userId);
        notification1.setMessage("Test Notification 1");
        notification1.setType(NotificationType.INFO);
        notification1.setRead(false);
        notification1.setCreatedAt(LocalDateTime.now());

        Notification notification2 = new Notification();
        notification2.setId(2L);
        notification2.setUserId(userId);
        notification2.setMessage("Test Notification 2");
        notification2.setType(NotificationType.ALERT);
        notification2.setRead(true);
        notification2.setCreatedAt(LocalDateTime.now().minusHours(1));

        when(notificationRepository.findByUserIdOrderByCreatedAtDesc(userId))
                .thenReturn(Arrays.asList(notification1, notification2));

        List<NotificationResponse> responses = notificationService.getMyNotifications(userId);

        assertEquals(2, responses.size());
        assertEquals("Test Notification 1", responses.get(0).getMessage());
        assertEquals("Test Notification 2", responses.get(1).getMessage());
        verify(notificationRepository, times(1)).findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Test
    void markAsRead_ShouldMarkNotificationAsRead() {
        Long notificationId = 1L;
        Notification notification = new Notification();
        notification.setId(notificationId);
        notification.setRead(false);

        when(notificationRepository.findById(notificationId)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        notificationService.markAsRead(notificationId);

        assertTrue(notification.getRead());
        verify(notificationRepository, times(1)).findById(notificationId);
        verify(notificationRepository, times(1)).save(notification);
    }

    @Test
    void markAsRead_ShouldThrowException_WhenNotificationNotFound() {
        Long notificationId = 1L;
        when(notificationRepository.findById(notificationId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> notificationService.markAsRead(notificationId));
        verify(notificationRepository, times(1)).findById(notificationId);
        verify(notificationRepository, never()).save(any(Notification.class));
    }

    @Test
    void getUnreadCount_ShouldReturnCount() {
        Long userId = 1L;
        Long expectedCount = 5L;
        when(notificationRepository.countByUserIdAndReadFalse(userId)).thenReturn(expectedCount);

        Long actualCount = notificationService.getUnreadCount(userId);

        assertEquals(expectedCount, actualCount);
        verify(notificationRepository, times(1)).countByUserIdAndReadFalse(userId);
    }
}
