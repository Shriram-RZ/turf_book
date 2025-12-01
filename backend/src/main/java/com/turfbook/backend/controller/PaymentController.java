package com.turfbook.backend.controller;

import com.turfbook.backend.dto.request.PaymentWebhookRequest;
import com.turfbook.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(@RequestBody PaymentWebhookRequest request) {
        try {
            paymentService.handleWebhook(request);
            return ResponseEntity.ok("Webhook processed");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
