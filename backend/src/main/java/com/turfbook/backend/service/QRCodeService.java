package com.turfbook.backend.service;

import org.springframework.stereotype.Service;

@Service
public class QRCodeService {

    public byte[] generateQRCode(String text, int width, int height) {
        // Mock implementation for now
        return new byte[0];
    }
}
