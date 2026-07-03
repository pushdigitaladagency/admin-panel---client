'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FileText, ImagePlus, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CountedField } from '@/components/ui/CountedField';
import { isUrl } from '@/lib/validators';
import MediaSelectModal from '@/components/media/MediaSelectModal';
import { resolveUploadUrl } from '@/components/ui/UploadField';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';

const NUMERIC = ['founded_year', 'smtp_port', 'map_zoom_level', 'session_timeout', 'max_login_attempts', 'latitude', 'longitude'];
const toNum = (v) => (v === '' || v === null || v === undefined ? null : Number(v));

const IMAGE_TYPES = ['PNG', 'JPG', 'JPEG', 'WEBP', 'GIF', 'SVG', 'ICO'];

const fileNameFromPath = (path) => (path ? String(path).split('/').pop() : '');
const fileTypeFromPath = (path) => (path ? fileNameFromPath(path).split('.').pop().toUpperCase() : '');

function FormMediaField({ label, value, onOpen, onClear, preview = true }) {
  const fileName = fileNameFromPath(value);

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {value ? (
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 14px', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)', background: 'var(--color-surface)',
          }}
        >
          {preview ? (
            <img src={resolveUploadUrl(value)} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} />
          ) : (
            <FileText size={22} className="text-muted" />
          )}
          <span style={{ flex: 1, fontSize: '0.8125rem', wordBreak: 'break-all' }}>{fileName}</span>
          
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClear} title="Remove">
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="premium-dropzone"
          onClick={onOpen}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 6, padding: '18px', width: '100%', border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'center',
          }}
        >
          {preview ? <ImagePlus size={26} className="text-muted" /> : <FileText size={26} className="text-muted" />}
          <span className="text-muted" style={{ fontSize: '0.8125rem' }}>Select Media</span>
        </button>
      )}
    </div>
  );
}

export function GlobalSettingsForm({ initialData }) {
  const router = useRouter();
  const { addToast } = useToast();
  const s = initialData || {};

  const [siteLogo, setSiteLogo] = React.useState(s.site_logo || '');
  const [footerLogo, setFooterLogo] = React.useState(s.footer_logo || '');
  const [mobileLogo, setMobileLogo] = React.useState(s.mobile_logo || '');
  const [favicon, setFavicon] = React.useState(s.favicon || '');
  const [ogImage, setOgImage] = React.useState(s.default_og_image || '');

  const [isMediaModalOpen, setIsMediaModalOpen] = React.useState(false);
  const [mediaTarget, setMediaTarget] = React.useState(null);

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
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
      // Security
      enable_recaptcha: s.enable_recaptcha || 'No', recaptcha_site_key: s.recaptcha_site_key || '', recaptcha_secret_key: s.recaptcha_secret_key || '',
      session_timeout: s.session_timeout ?? 30, max_login_attempts: s.max_login_attempts ?? 5, force_https: s.force_https || 'Yes',
    },
  });

  const onSubmit = async (data) => {
    const payload = { ...data, site_logo: siteLogo || null, footer_logo: footerLogo || null, mobile_logo: mobileLogo || null, favicon: favicon || null, default_og_image: ogImage || null };
    NUMERIC.forEach((k) => { payload[k] = toNum(payload[k]); });
    try {
      await api.put('/global-settings', payload);
      addToast('Global settings saved successfully', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to save settings', 'danger');
    }
  };

  const openMediaPicker = (target) => {
    setMediaTarget(target);
    setIsMediaModalOpen(true);
  };

  const closeMediaPicker = () => {
    setIsMediaModalOpen(false);
    setMediaTarget(null);
  };

  const handleMediaSelect = (media) => {
    const selectedPath = media?.path || media?.url || '';
    if (!selectedPath) return;
    const selectedType = String(media?.type || fileTypeFromPath(selectedPath)).toUpperCase();

    if (!IMAGE_TYPES.includes(selectedType)) {
      addToast('Only image files are allowed', 'danger');
      return;
    }

    if (mediaTarget === 'siteLogo') setSiteLogo(selectedPath);
    else if (mediaTarget === 'footerLogo') setFooterLogo(selectedPath);
    else if (mediaTarget === 'mobileLogo') setMobileLogo(selectedPath);
    else if (mediaTarget === 'favicon') setFavicon(selectedPath);
    else if (mediaTarget === 'ogImage') setOgImage(selectedPath);

    closeMediaPicker();
  };

  const field = (name, label, type = 'text', opts = {}) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <Input type={type} {...register(name, opts.rules)} className={errors[name] ? 'error' : ''} />
      {errors[name] && <p className="form-error">{errors[name].message}</p>}
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
    <>
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
            {field('facebook_url', 'Facebook URL', 'text', { rules: { validate: isUrl } })}
            {field('twitter_url', 'Twitter URL', 'text', { rules: { validate: isUrl } })}
            {field('linkedin_url', 'LinkedIn URL', 'text', { rules: { validate: isUrl } })}
            {field('instagram_url', 'Instagram URL', 'text', { rules: { validate: isUrl } })}
            {field('youtube_url', 'YouTube URL', 'text', { rules: { validate: isUrl } })}
            {field('pinterest_url', 'Pinterest URL', 'text', { rules: { validate: isUrl } })}
            {field('whatsapp_url', 'WhatsApp URL', 'text', { rules: { validate: isUrl } })}
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
            <FormMediaField label="Site Logo" value={siteLogo} onOpen={() => openMediaPicker('siteLogo')} onClear={() => setSiteLogo('')} />
            <FormMediaField label="Footer Logo" value={footerLogo} onOpen={() => openMediaPicker('footerLogo')} onClear={() => setFooterLogo('')} />
            <FormMediaField label="Mobile Logo" value={mobileLogo} onOpen={() => openMediaPicker('mobileLogo')} onClear={() => setMobileLogo('')} />
            <FormMediaField label="Favicon" value={favicon} onOpen={() => openMediaPicker('favicon')} onClear={() => setFavicon('')} />
            <FormMediaField label="Default OG Image" value={ogImage} onOpen={() => openMediaPicker('ogImage')} onClear={() => setOgImage('')} />
          </div>
        ))}

        {section('SEO Defaults', (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CountedField control={control} register={register} name="default_meta_title" label="Default Meta Title" limit={255} />
              <CountedField control={control} register={register} errors={errors} name="default_canonical_url" label="Default Canonical URL" limit={255} rules={{ validate: isUrl }} />
              {selectField('robots', 'Robots', ['index, follow', 'noindex, nofollow'])}
            </div>
            <CountedField control={control} register={register} name="default_meta_keywords" label="Default Meta Keywords" multiline />
            <CountedField control={control} register={register} name="default_meta_description" label="Default Meta Description" multiline />
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

        {section('Security', (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectField('enable_recaptcha', 'Enable reCAPTCHA', ['No', 'Yes'])}
            {field('recaptcha_site_key', 'reCAPTCHA Site Key')}
            {field('recaptcha_secret_key', 'reCAPTCHA Secret Key')}
            {field('session_timeout', 'Session Timeout (min)', 'number')}
            {field('max_login_attempts', 'Max Login Attempts', 'number')}
            {selectField('force_https', 'Force HTTPS', ['Yes', 'No'])}
          </div>
        ))}

        <div className="flex justify-end gap-3">
          <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save Settings'}</Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/dashboard')}>Cancel</Button>
        </div>
      </form>

      <MediaSelectModal
        isOpen={isMediaModalOpen}
        onClose={closeMediaPicker}
        onSelect={handleMediaSelect}
        multiple={false}
      />
    </>
  );
}
