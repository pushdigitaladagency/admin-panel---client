'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UploadField } from '@/components/ui/UploadField';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';

const NUMERIC = ['founded_year', 'smtp_port', 'map_zoom_level', 'session_timeout', 'max_login_attempts', 'max_upload_size', 'latitude', 'longitude'];
const toNum = (v) => (v === '' || v === null || v === undefined ? null : Number(v));

export function GlobalSettingsForm({ initialData }) {
  const router = useRouter();
  const { addToast } = useToast();
  const s = initialData || {};

  const [siteLogo, setSiteLogo] = React.useState(s.site_logo || '');
  const [footerLogo, setFooterLogo] = React.useState(s.footer_logo || '');
  const [mobileLogo, setMobileLogo] = React.useState(s.mobile_logo || '');
  const [favicon, setFavicon] = React.useState(s.favicon || '');
  const [ogImage, setOgImage] = React.useState(s.default_og_image || '');

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      // General
      site_name: s.site_name || '', site_tagline: s.site_tagline || '', default_language: s.default_language || 'English',
      timezone: s.timezone || '', date_format: s.date_format || '', time_format: s.time_format || '', currency: s.currency || '',
      // Company
      company_name: s.company_name || '', company_registration_no: s.company_registration_no || '', gst_tax_number: s.gst_tax_number || '',
      founded_year: s.founded_year ?? '', about_company: s.about_company || '',
      // Address
      address: s.address || '', city: s.city || '', state: s.state || '', country: s.country || '', postal_code: s.postal_code || '',
      // Contact
      primary_email: s.primary_email || '', secondary_email: s.secondary_email || '', primary_phone: s.primary_phone || '',
      secondary_phone: s.secondary_phone || '', whatsapp_number: s.whatsapp_number || '', toll_free_number: s.toll_free_number || '',
      // Social
      facebook_url: s.facebook_url || '', twitter_url: s.twitter_url || '', linkedin_url: s.linkedin_url || '', instagram_url: s.instagram_url || '',
      youtube_url: s.youtube_url || '', pinterest_url: s.pinterest_url || '', whatsapp_url: s.whatsapp_url || '',
      // SMTP
      admin_email: s.admin_email || '', from_name: s.from_name || '', from_email: s.from_email || '', reply_to_email: s.reply_to_email || '',
      cc_email: s.cc_email || '', bcc_email: s.bcc_email || '', smtp_host: s.smtp_host || '', smtp_port: s.smtp_port ?? '',
      smtp_username: s.smtp_username || '', smtp_password: s.smtp_password || '', encryption: s.encryption || 'TLS', smtp_status: s.smtp_status || 'Enabled',
      // SEO
      default_meta_title: s.default_meta_title || '', default_meta_keywords: s.default_meta_keywords || '',
      default_meta_description: s.default_meta_description || '', default_canonical_url: s.default_canonical_url || '', robots: s.robots || 'index, follow',
      // Analytics
      google_analytics_id: s.google_analytics_id || '', google_tag_manager_id: s.google_tag_manager_id || '', facebook_pixel_id: s.facebook_pixel_id || '',
      header_scripts: s.header_scripts || '', footer_scripts: s.footer_scripts || '',
      // Maps
      google_maps_api_key: s.google_maps_api_key || '', map_embed_url: s.map_embed_url || '', latitude: s.latitude ?? '', longitude: s.longitude ?? '', map_zoom_level: s.map_zoom_level ?? 15,
      // Footer
      copyright_text: s.copyright_text || '', powered_by_text: s.powered_by_text || '', footer_note: s.footer_note || '',
      // Maintenance
      maintenance_mode: s.maintenance_mode || 'Off', maintenance_message: s.maintenance_message || '', allowed_ip_addresses: s.allowed_ip_addresses || '',
      expected_back_online: s.expected_back_online ? String(s.expected_back_online).slice(0, 16) : '',
      // Security
      enable_recaptcha: s.enable_recaptcha || 'No', recaptcha_site_key: s.recaptcha_site_key || '', recaptcha_secret_key: s.recaptcha_secret_key || '',
      session_timeout: s.session_timeout ?? 30, max_login_attempts: s.max_login_attempts ?? 5, force_https: s.force_https || 'Yes', enable_two_factor: s.enable_two_factor || 'No',
      // Uploads
      max_upload_size: s.max_upload_size ?? 25, allowed_image_formats: s.allowed_image_formats || '', allowed_document_formats: s.allowed_document_formats || '',
      image_compression: s.image_compression || 'Yes', max_image_dimensions: s.max_image_dimensions || '',
    },
  });

  const onSubmit = async (data) => {
    const payload = { ...data, site_logo: siteLogo || null, footer_logo: footerLogo || null, mobile_logo: mobileLogo || null, favicon: favicon || null, default_og_image: ogImage || null };
    NUMERIC.forEach((k) => { payload[k] = toNum(payload[k]); });
    payload.expected_back_online = data.expected_back_online || null;
    try {
      await api.put('/global-settings', payload);
      addToast('Global settings saved successfully', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to save settings', 'danger');
    }
  };

  const field = (name, label, type = 'text') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <Input type={type} {...register(name)} />
    </div>
  );

  const selectField = (name, label, options) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select className="form-select" {...register(name)}>{options.map((o) => <option key={o}>{o}</option>)}</select>
    </div>
  );

  const textArea = (name, label, mono) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <textarea className="form-textarea" style={{ minHeight: 80, fontFamily: mono ? 'monospace' : undefined }} {...register(name)} />
    </div>
  );

  const section = (title, body) => (
    <div className="card">
      <div className="card-header"><h3 className="card-title">{title}</h3></div>
      <div className="card-body">{body}</div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {section('General', (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('site_name', 'Site Name')}
          {field('site_tagline', 'Site Tagline')}
          {field('default_language', 'Default Language')}
          {field('timezone', 'Timezone')}
          {field('date_format', 'Date Format')}
          {field('time_format', 'Time Format')}
          {field('currency', 'Currency')}
        </div>
      ))}

      {section('Company', (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('company_name', 'Company Name')}
            {field('company_registration_no', 'Registration No.')}
            {field('gst_tax_number', 'GST / Tax Number')}
            {field('founded_year', 'Founded Year', 'number')}
          </div>
          {textArea('about_company', 'About Company')}
        </>
      ))}

      {section('Address', (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('address', 'Address')}
          {field('city', 'City')}
          {field('state', 'State')}
          {field('country', 'Country')}
          {field('postal_code', 'Postal Code')}
        </div>
      ))}

      {section('Contact', (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('primary_email', 'Primary Email', 'email')}
          {field('secondary_email', 'Secondary Email', 'email')}
          {field('primary_phone', 'Primary Phone')}
          {field('secondary_phone', 'Secondary Phone')}
          {field('whatsapp_number', 'WhatsApp Number')}
          {field('toll_free_number', 'Toll-free Number')}
        </div>
      ))}

      {section('Social Links', (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('facebook_url', 'Facebook URL')}
          {field('twitter_url', 'Twitter URL')}
          {field('linkedin_url', 'LinkedIn URL')}
          {field('instagram_url', 'Instagram URL')}
          {field('youtube_url', 'YouTube URL')}
          {field('pinterest_url', 'Pinterest URL')}
          {field('whatsapp_url', 'WhatsApp URL')}
        </div>
      ))}

      {section('Email / SMTP', (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('admin_email', 'Admin Email', 'email')}
          {field('from_name', 'From Name')}
          {field('from_email', 'From Email', 'email')}
          {field('reply_to_email', 'Reply-To Email', 'email')}
          {field('cc_email', 'CC Email')}
          {field('bcc_email', 'BCC Email')}
          {field('smtp_host', 'SMTP Host')}
          {field('smtp_port', 'SMTP Port', 'number')}
          {field('smtp_username', 'SMTP Username')}
          {field('smtp_password', 'SMTP Password', 'password')}
          {selectField('encryption', 'Encryption', ['SSL', 'TLS', 'None'])}
          {selectField('smtp_status', 'SMTP Status', ['Enabled', 'Disabled'])}
        </div>
      ))}

      {section('Branding', (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UploadField label="Site Logo" accept="image/*" value={siteLogo} onChange={setSiteLogo} />
          <UploadField label="Footer Logo" accept="image/*" value={footerLogo} onChange={setFooterLogo} />
          <UploadField label="Mobile Logo" accept="image/*" value={mobileLogo} onChange={setMobileLogo} />
          <UploadField label="Favicon" accept="image/*" value={favicon} onChange={setFavicon} />
          <UploadField label="Default OG Image" accept="image/*" value={ogImage} onChange={setOgImage} />
        </div>
      ))}

      {section('SEO Defaults', (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('default_meta_title', 'Default Meta Title')}
            {field('default_canonical_url', 'Default Canonical URL')}
            {selectField('robots', 'Robots', ['index, follow', 'noindex, nofollow'])}
          </div>
          {textArea('default_meta_keywords', 'Default Meta Keywords')}
          {textArea('default_meta_description', 'Default Meta Description')}
        </>
      ))}

      {section('Analytics & Scripts', (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {field('google_analytics_id', 'Google Analytics ID')}
            {field('google_tag_manager_id', 'Google Tag Manager ID')}
            {field('facebook_pixel_id', 'Facebook Pixel ID')}
          </div>
          {textArea('header_scripts', 'Header Scripts', true)}
          {textArea('footer_scripts', 'Footer Scripts', true)}
        </>
      ))}

      {section('Maps', (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('google_maps_api_key', 'Google Maps API Key')}
            {field('latitude', 'Latitude', 'number')}
            {field('longitude', 'Longitude', 'number')}
            {field('map_zoom_level', 'Map Zoom Level', 'number')}
          </div>
          {textArea('map_embed_url', 'Map Embed URL')}
        </>
      ))}

      {section('Footer', (
        <>
          {field('powered_by_text', 'Powered By Text')}
          {textArea('copyright_text', 'Copyright Text')}
          {textArea('footer_note', 'Footer Note')}
        </>
      ))}

      {section('Maintenance', (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectField('maintenance_mode', 'Maintenance Mode', ['Off', 'On'])}
            {field('expected_back_online', 'Expected Back Online', 'datetime-local')}
            {field('allowed_ip_addresses', 'Allowed IP Addresses')}
          </div>
          {textArea('maintenance_message', 'Maintenance Message')}
        </>
      ))}

      {section('Security', (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectField('enable_recaptcha', 'Enable reCAPTCHA', ['No', 'Yes'])}
          {field('recaptcha_site_key', 'reCAPTCHA Site Key')}
          {field('recaptcha_secret_key', 'reCAPTCHA Secret Key')}
          {field('session_timeout', 'Session Timeout (min)', 'number')}
          {field('max_login_attempts', 'Max Login Attempts', 'number')}
          {selectField('force_https', 'Force HTTPS', ['Yes', 'No'])}
          {selectField('enable_two_factor', 'Enable Two-Factor', ['No', 'Yes'])}
        </div>
      ))}

      {section('Uploads', (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('max_upload_size', 'Max Upload Size (MB)', 'number')}
          {field('allowed_image_formats', 'Allowed Image Formats')}
          {field('allowed_document_formats', 'Allowed Document Formats')}
          {selectField('image_compression', 'Image Compression', ['Yes', 'No'])}
          {field('max_image_dimensions', 'Max Image Dimensions')}
        </div>
      ))}

      <div className="flex justify-end gap-3">
        <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save Settings'}</Button>
        <Button type="button" variant="secondary" onClick={() => router.push('/dashboard')}>Cancel</Button>
      </div>
    </form>
  );
}
