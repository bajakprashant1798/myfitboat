
REVOKE INSERT ON public.newsletter_subscribers FROM anon, authenticated;
REVOKE INSERT ON public.contact_messages FROM anon, authenticated;
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can contact" ON public.contact_messages;
