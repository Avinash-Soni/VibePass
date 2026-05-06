package com.VibePass.ticket.services.impl;

import com.VibePass.ticket.domain.entities.QrCode;
import com.VibePass.ticket.domain.entities.QrCodeStatusEnum;
import com.VibePass.ticket.domain.entities.Ticket;
import com.VibePass.ticket.exceptions.QrCodeGenerationException;
import com.VibePass.ticket.exceptions.QrCodeNotFoundException;
import com.VibePass.ticket.repositories.QrCodeRepository;
import com.VibePass.ticket.services.QrCodeService;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class QrCodeServiceImpl implements QrCodeService {

    private static final int QR_HEIGHT = 300;
    private static final int QR_WIDTH = 300;

    private final QRCodeWriter qrCodeWriter;
    private final QrCodeRepository qrCodeRepository;

    @Override
    @Transactional
    public QrCode generateQrCode(Ticket ticket) {
        try {
            // This is the "Secret Key" encoded in the QR
            UUID uniqueId = UUID.randomUUID();

            QrCode qrCode = new QrCode();
            qrCode.setStatus(QrCodeStatusEnum.Active);

            // ✅ FIX: Store the UUID string in 'value' so the scanner can search for it!
            qrCode.setValue(uniqueId.toString());

            qrCode.setTicket(ticket);
            qrCode.setCreatedAt(java.time.LocalDateTime.now());
            qrCode.setUpdatedAt(java.time.LocalDateTime.now());

            return qrCodeRepository.save(qrCode);

        } catch(Exception ex) {
            log.error("Failed to generate QR record for ticket: {}", ticket.getId());
            throw new QrCodeGenerationException("Failed to generate QR Code", ex);
        }
    }

    @Override
    public byte[] getQrCodeImageForUserAndTicket(UUID userId, UUID ticketId) {
        QrCode qrCode = qrCodeRepository.findByTicketIdAndTicketPurchaserId(ticketId, userId)
                .orElseThrow(QrCodeNotFoundException::new);

        try {
            // ✅ FIX: Generate the image ON THE FLY when the user wants to see it
            // This keeps your database small and fast.
            return generateQrCodeImageBytes(UUID.fromString(qrCode.getValue()));
        } catch(Exception ex) {
            log.error("Error generating QR image for ticket ID: {}", ticketId, ex);
            throw new QrCodeNotFoundException();
        }
    }

    // Helper to generate the actual PNG bytes
    private byte[] generateQrCodeImageBytes(UUID uniqueId) throws WriterException, IOException {
        BitMatrix bitMatrix = qrCodeWriter.encode(
                uniqueId.toString(),
                BarcodeFormat.QR_CODE,
                QR_WIDTH,
                QR_HEIGHT
        );

        BufferedImage qrCodeImage = MatrixToImageWriter.toBufferedImage(bitMatrix);
        try(ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            ImageIO.write(qrCodeImage, "PNG", baos);
            return baos.toByteArray();
        }
    }
}

