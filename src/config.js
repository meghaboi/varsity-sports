// ---------------------------------------------------------------------
// Change these two values whenever you need to update where applications
// get sent, no code changes required elsewhere in the app.
// ---------------------------------------------------------------------

// The inbox that should receive new volunteer applications.
// NOTE: Formspree sends mail to whatever address is configured on the
// Formspree form itself (see README "Email setup"), so to actually change
// the recipient you also need to update it in your Formspree dashboard.
// This constant is kept here so it's documented in one obvious place.
export const RECIPIENT_EMAIL = 'meghanadh.pamidi@gmail.com';

// Create a free form at https://formspree.io, point it at RECIPIENT_EMAIL
// above, then paste the form ID here (the part after /f/ in your endpoint).
export const FORMSPREE_FORM_ID = 'YOUR_FORMSPREE_FORM_ID';
