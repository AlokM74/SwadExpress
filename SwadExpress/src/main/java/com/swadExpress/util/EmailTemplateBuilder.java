package com.swadExpress.util;

public final class EmailTemplateBuilder {

    private static final String BRAND = "#7a1f1f";
    private static final String DARK = "#171717";
    private static final String MUTED = "#6b7280";

    private EmailTemplateBuilder() {
    }

    public static String otpEmail(String title, String message, String otp, String recipientName) {
        return page(
                "<p style=\"margin:0 0 8px;color:" + DARK + ";font-size:16px;\">Hello "
                        + escape(recipientName) + ",</p>"
                        + "<h1 style=\"margin:0 0 12px;color:" + DARK + ";font-size:24px;\">"
                        + escape(title) + "</h1>"
                        + "<p style=\"margin:0 0 22px;color:" + MUTED + ";font-size:15px;line-height:1.6;\">"
                        + escape(message) + "</p>"
                        + "<div style=\"padding:18px;text-align:center;border-radius:12px;background:#fff1f2;border:1px solid #fecdd3;\">"
                        + "<span style=\"display:block;margin-bottom:6px;color:" + MUTED + ";font-size:12px;letter-spacing:2px;text-transform:uppercase;\">Your OTP</span>"
                        + "<strong style=\"color:" + BRAND + ";font-size:34px;letter-spacing:8px;\">" + escape(otp) + "</strong>"
                        + "</div>"
                        + "<p style=\"margin:22px 0 0;color:" + MUTED + ";font-size:13px;line-height:1.5;\">"
                        + "This OTP expires in 5 minutes. If you did not request this, you can safely ignore this email."
                        + "</p>"
        );
    }

    public static String page(String content) {
        return "<!doctype html><html><body style=\"margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;\">"
                + "<div style=\"padding:32px 12px;\">"
                + "<div style=\"max-width:600px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.08);\">"
                + "<div style=\"padding:24px 28px;background:" + BRAND + ";color:#ffffff;\">"
                + "<div style=\"font-size:24px;font-weight:700;\">Swad<span style=\"color:#fca5a5;\">Express</span></div>"
                + "<div style=\"margin-top:6px;font-size:12px;opacity:.85;\">Delicious moments, delivered.</div>"
                + "</div>"
                + "<div style=\"padding:28px;\">" + content + "</div>"
                + "<div style=\"padding:18px 28px;background:#fafafa;color:" + MUTED + ";font-size:12px;text-align:center;\">"
                + "© SwadExpress · Please do not reply to this automated email"
                + "</div></div></div></body></html>";
    }

    public static String escape(Object value) {
        if (value == null) {
            return "";
        }
        return String.valueOf(value)
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
