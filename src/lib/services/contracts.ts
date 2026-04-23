import type { User } from "@/lib/contracts/types";
import type { SubscriptionTier } from "@/lib/contracts/enums";

export type ActionResult<T> =
  | { success: true; data: T; message?: string }
  | { success: false; message: string; errors?: Record<string, string[]> };

export interface AuthOtpService {
  sendOtp(phone: string): Promise<ActionResult<{ challengeId: string }>>;
  verifyOtp(
    phone: string,
    code: string,
  ): Promise<ActionResult<{ verified: true }>>;
}

export interface FileStorageService {
  createUploadUrl(fileName: string): Promise<ActionResult<{ url: string }>>;
}

export interface PdfReportService {
  generateProjectReport(projectId: string): Promise<
    ActionResult<{ downloadUrl: string; shareUrl: string }>
  >;
}

export interface PaymentGatewayService {
  startCheckout(
    tier: SubscriptionTier,
    method: string,
  ): Promise<ActionResult<{ checkoutUrl: string; reference: string }>>;
}

export interface NotificationService {
  sendWhatsApp(phone: string, message: string): Promise<ActionResult<true>>;
}

export interface SessionService {
  getCurrentUser(): Promise<User>;
}
