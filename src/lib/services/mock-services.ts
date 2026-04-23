import { mockCurrentUser } from "@/lib/contracts/mock-data";
import type {
  AuthOtpService,
  FileStorageService,
  NotificationService,
  PaymentGatewayService,
  PdfReportService,
  SessionService,
} from "./contracts";

export const mockOtpService: AuthOtpService = {
  async sendOtp(phone) {
    return {
      success: true,
      data: { challengeId: `otp-${phone}` },
      message: "Kode OTP berhasil dikirim.",
    };
  },
  async verifyOtp(_phone, code) {
    if (code !== "123456") {
      return {
        success: false,
        message: "Kode OTP tidak valid. Gunakan 123456 untuk mode demo.",
      };
    }

    return {
      success: true,
      data: { verified: true },
      message: "Nomor berhasil diverifikasi.",
    };
  },
};

export const mockFileStorageService: FileStorageService = {
  async createUploadUrl(fileName) {
    return {
      success: true,
      data: { url: `https://uploadthing.com/f/${fileName}` },
    };
  },
};

export const mockPdfReportService: PdfReportService = {
  async generateProjectReport(projectId) {
    return {
      success: true,
      data: {
        downloadUrl: `/api/reports/${projectId}.pdf`,
        shareUrl: `/pantau/${projectId}?shared=1`,
      },
    };
  },
};

export const mockPaymentGatewayService: PaymentGatewayService = {
  async startCheckout(tier, method) {
    return {
      success: true,
      data: {
        checkoutUrl: `/checkout/success?tier=${tier}&method=${method}`,
        reference: `midtrans-${tier}-${method}`.toLowerCase(),
      },
    };
  },
};

export const mockNotificationService: NotificationService = {
  async sendWhatsApp() {
    return {
      success: true,
      data: true,
      message: "Notifikasi WhatsApp demo berhasil dikirim.",
    };
  },
};

export const mockSessionService: SessionService = {
  async getCurrentUser() {
    return mockCurrentUser;
  },
};
