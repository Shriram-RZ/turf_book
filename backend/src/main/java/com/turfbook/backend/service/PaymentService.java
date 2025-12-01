package com.turfbook.backend.service;

import com.turfbook.backend.dto.request.PaymentRequest;
import com.turfbook.backend.dto.request.PaymentWebhookRequest;
import com.turfbook.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingService bookingService;

    @Transactional
    public void processPayment(PaymentRequest request) {
        // Mock payment processing logic
        // In a real app, this would interact with a payment gateway
        bookingService.processPayment(request.getBookingId(), null, "MOCK_PAYMENT_ID");
    }

    @Transactional
    public void handleWebhook(PaymentWebhookRequest request) {
        if ("SUCCESS".equals(request.getStatus())) {
            bookingService.processPayment(request.getBookingId(), null, request.getPaymentId());
        }
    }
}
