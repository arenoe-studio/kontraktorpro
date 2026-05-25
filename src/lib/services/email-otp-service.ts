import "server-only";
import { Resend } from "resend";
import type { AuthOtpService } from "./contracts";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "noreply@kontraktorpro.id";

function buildEmailHtml(code: string): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kode Verifikasi KontraktorPro</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;padding:40px;max-width:480px;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <h1 style="margin:0;font-size:20px;color:#111827;font-weight:700;">KontraktorPro</h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:16px;">
              <p style="margin:0;font-size:16px;color:#374151;">Kode verifikasi Anda:</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <div style="display:inline-block;background-color:#f0fdf4;border:2px solid #16a34a;border-radius:8px;padding:16px 32px;">
                <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#15803d;">${code}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:8px;">
              <p style="margin:0;font-size:14px;color:#6b7280;">Kode ini berlaku selama 15 menit.</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:8px;">
              <p style="margin:0;font-size:14px;color:#6b7280;">Jangan bagikan kode ini kepada siapapun.</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:16px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">Jika Anda tidak meminta kode ini, abaikan email ini.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const emailOtpService: AuthOtpService = {
  async sendOtp(
    email: string,
    code: string,
  ) {
    try {
      const { error } = await getResend().emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Kode Verifikasi KontraktorPro",
        html: buildEmailHtml(code),
      });

      if (error) {
        return {
          success: false,
          message: "Gagal mengirim email OTP. Coba lagi.",
        };
      }

      return { success: true, data: { challengeId: "" } };
    } catch {
      return {
        success: false,
        message: "Gagal mengirim email OTP. Coba lagi.",
      };
    }
  },
};
