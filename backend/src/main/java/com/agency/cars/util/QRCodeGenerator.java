// src/main/java/com/agency/cars/util/QRCodeGenerator.java
package com.agency.cars.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import java.io.ByteArrayOutputStream;
import java.util.Base64;

public class QRCodeGenerator {

    public static String getQRCodeImage(String text, int width, int height) throws Exception {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);

            byte[] encodedBytes = Base64.getEncoder().encode(pngOutputStream.toByteArray());
            return new String(encodedBytes)
                    .replace("\n", "")
                    .replace("\r", "");
        } catch (WriterException | java.io.IOException e) {
            throw new Exception("Erreur lors de la génération du QR code", e);
        }
    }
}