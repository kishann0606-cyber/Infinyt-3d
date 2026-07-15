interface EnquiryPayload {
  enquiryId?: string;
  enquiryType: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  product?: string;
  quantity?: string;
  message: string;
  fileLinks?: string[];
  submittedAt?: string;
}

export async function sendEnquiryEmail(payload: EnquiryPayload): Promise<void> {
  try {
    await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-enquiry-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          ...payload,
          submittedAt: payload.submittedAt || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        }),
      }
    );
    // Email failures are non-blocking — enquiry is already saved in DB
  } catch {
    // Silently swallow — the enquiry is already in Supabase
  }
}
