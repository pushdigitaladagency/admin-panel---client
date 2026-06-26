'use client';

import React from 'react';
import { ImagePlus, FileText } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import { useTerms } from '@/context/TermsContext';
import MediaSelectModal from '@/components/media/MediaSelectModal';
import { api, BASE_URL, uploadFile } from '@/lib/api';

const resolveImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const baseHost = BASE_URL.replace(/\/api$/, '');
  return `${baseHost}/${path.replace(/^\/?/, '')}`;
};

// Map frontend postType slug to API path
const POST_API = {
  news: '/news',
  event: '/events',
  'press-release': '/press-releases',
};

export function PostForm({ initialData, postType }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const { addToast } = useToast();
  const { getTerms } = useTerms();

  const featuredImageInputRef = React.useRef(null);
  const galleryImagesInputRef = React.useRef(null);

  const [featuredImagePreview, setFeaturedImagePreview] = React.useState(() => {
    return initialData?.featured_image ? resolveImageUrl(initialData.featured_image) : '';
  });
  const [galleryImagesPreviews, setGalleryImagesPreviews] = React.useState(() => {
    if (!initialData?.gallery_images) return [];
    return initialData.gallery_images
      .split(',')
      .map(img => img.trim())
      .filter(Boolean)
      .map(resolveImageUrl);
  });
  const [enquiryAttachmentName, setEnquiryAttachmentName] = React.useState(() => {
    const attachment = initialData?.attachment;
    return typeof attachment === 'string' ? attachment.split('/').pop() : '';
  });

  const [isMediaModalOpen, setIsMediaModalOpen] = React.useState(false);
  const [mediaTarget, setMediaTarget] = React.useState(null); // 'featured' or 'gallery'
  const [editorLoaded, setEditorLoaded] = React.useState(false);

  const summaryEditorRef = React.useRef(null);
  const contentEditorRef = React.useRef(null);
  const summaryEditorInstRef = React.useRef(null);
  const contentEditorInstRef = React.useRef(null);

  const handleFeaturedImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map(file => URL.createObjectURL(file));
    setGalleryImagesPreviews(urls);
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: isEdit
      ? {
        id: initialData?.id,
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        category: initialData?.category || '',
        excerpt: initialData?.excerpt || '',
        content: initialData?.content || '',
        featured_image: initialData?.featured_image || '',
        attachment: initialData?.attachment || '',
        publish_date: initialData?.publish_date || new Date().toISOString().split('T')[0],
        expiry_date: initialData?.expiry_date || '',
        tags: initialData?.tags || '',
        featured: initialData?.featured || 'no',
        seo_title: initialData?.seo_title || '',
        seo_keywords: initialData?.seo_keywords || '',
        seo_description: initialData?.seo_description || '',
        canonical_url: initialData?.canonical_url || '',
        status: initialData?.status || 'draft',
        post_type: postType,
        gallery_images: initialData?.gallery_images || '',
        news_source: initialData?.news_source || '',
        author: initialData?.author || '',
        event_start_date: initialData?.event_start_date || '',
        event_end_date: initialData?.event_end_date || '',
        reg_start_date: initialData?.reg_start_date || '',
        reg_end_date: initialData?.reg_end_date || '',
        venue: initialData?.venue || '',
        address: initialData?.address || '',
        map_url: initialData?.map_url || '',
        organizer_name: initialData?.organizer_name || '',
        organizer_email: initialData?.organizer_email || '',
        organizer_contact: initialData?.organizer_contact || '',
        registration_link: initialData?.registration_link || '',
        max_participants: initialData?.max_participants || '',
        event_status: initialData?.event_status || 'Upcoming',
      }
      : {
        title: '',
        slug: '',
        category: '',
        excerpt: '',
        content: '',
        featured_image: '',
        attachment: '',
        publish_date: new Date().toISOString().split('T')[0],
        expiry_date: '',
        tags: '',
        featured: 'no',
        seo_title: '',
        seo_keywords: '',
        seo_description: '',
        canonical_url: '',
        status: 'draft',
        post_type: postType,
        gallery_images: '',
        news_source: '',
        author: '',
        event_start_date: '',
        event_end_date: '',
        reg_start_date: '',
        reg_end_date: '',
        venue: '',
        address: '',
        map_url: '',
        organizer_name: '',
        organizer_email: '',
        organizer_contact: '',
        registration_link: '',
        max_participants: '',
        event_status: 'Upcoming',
      },
  });

  // Register featured_image and gallery_images as custom virtual fields since they are populated via MediaSelectModal
  React.useEffect(() => {
    register('featured_image', (isEdit || postType === 'event') ? {} : { required: 'Featured Image is required' });
    register('gallery_images');
  }, [register, isEdit, postType]);

  const attachmentRegister = register('attachment');

  const handleMediaModalSelect = (media) => {
    if (mediaTarget === 'featured') {
      const url = media.url;
      setFeaturedImagePreview(url);
      setValue('featured_image', media.path || url, { shouldValidate: true, shouldDirty: true });
    } else if (mediaTarget === 'gallery') {
      const urls = Array.isArray(media) ? media.map(m => m.url) : [media.url];
      const paths = Array.isArray(media) ? media.map(m => m.path || m.url) : [media.path || media.url];
      setGalleryImagesPreviews(urls);
      setValue('gallery_images', paths.join(','), { shouldValidate: true, shouldDirty: true });
    }
  };

  const postTitle = watch('title');

  // Load CKEditor 5 from CDN
  React.useEffect(() => {
    if (window.ClassicEditor) {
      setEditorLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.ckeditor.com/ckeditor5/36.0.1/classic/ckeditor.js';
    script.async = true;
    script.onload = () => setEditorLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Register form fields
  React.useEffect(() => {
    register('excerpt', {
      required: postType === 'event' ? 'Short Description is required' : postType === 'news' ? 'Summary is required' : 'Short Description is required'
    });
    register('content', {
      required: postType === 'event' ? 'Event Description is required' : postType === 'news' ? 'Full Content is required' : 'Detailed Content is required'
    });
  }, [register, postType]);

  // Handle Slug generation
  React.useEffect(() => {
    if (!isEdit && postTitle !== undefined) {
      const generatedSlug = postTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', generatedSlug, { shouldDirty: true, shouldValidate: true });
    }
  }, [postTitle, setValue, isEdit]);

  // Initialize and Sync CKEditors
  React.useEffect(() => {
    if (!editorLoaded || !window.ClassicEditor) return;

    let summaryEditor = null;
    let contentEditor = null;

    // Initialize Summary Editor
    if (summaryEditorRef.current && !summaryEditorInstRef.current) {
      window.ClassicEditor.create(summaryEditorRef.current, {
        toolbar: ['bold', 'italic', 'underline', 'bulletedList', 'numberedList', 'undo', 'redo', 'link']
      })
        .then(editor => {
          summaryEditorInstRef.current = editor;
          summaryEditor = editor;
          editor.setData(initialData?.excerpt || '');
          editor.model.document.on('change:data', () => {
            setValue('excerpt', editor.getData(), { shouldDirty: true, shouldValidate: true });
          });
        })
        .catch(err => console.error('Error initializing summary CKEditor:', err));
    }

    // Initialize Content Editor
    if (contentEditorRef.current && !contentEditorInstRef.current) {
      window.ClassicEditor.create(contentEditorRef.current, {
        toolbar: ['bold', 'italic', 'underline', 'bulletedList', 'numberedList', 'undo', 'redo', 'link', 'uploadImage', 'insertTable', 'blockQuote'],
        extraPlugins: [function(editor) {
          editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return {
              upload: () => loader.file.then(file => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve({ default: reader.result });
                reader.onerror = err => reject(err);
                reader.readAsDataURL(file);
              })),
              abort: () => {}
            };
          };
        }]
      })
        .then(editor => {
          contentEditorInstRef.current = editor;
          contentEditor = editor;
          editor.setData(initialData?.content || '');
          editor.model.document.on('change:data', () => {
            setValue('content', editor.getData(), { shouldDirty: true, shouldValidate: true });
          });
        })
        .catch(err => console.error('Error initializing content CKEditor:', err));
    }

    return () => {
      if (summaryEditor) {
        summaryEditor.destroy()
          .then(() => {
            if (summaryEditorInstRef.current === summaryEditor) {
              summaryEditorInstRef.current = null;
            }
          })
          .catch(err => console.error(err));
      }
      if (contentEditor) {
        contentEditor.destroy()
          .then(() => {
            if (contentEditorInstRef.current === contentEditor) {
              contentEditorInstRef.current = null;
            }
          })
          .catch(err => console.error(err));
      }
    };
  }, [editorLoaded, initialData]);

  // Keep editors synced if initialData changes after initialization
  React.useEffect(() => {
    if (summaryEditorInstRef.current && initialData?.excerpt !== undefined) {
      if (summaryEditorInstRef.current.getData() !== (initialData.excerpt || '')) {
        summaryEditorInstRef.current.setData(initialData.excerpt || '');
      }
    }
    if (contentEditorInstRef.current && initialData?.content !== undefined) {
      if (contentEditorInstRef.current.getData() !== (initialData.content || '')) {
        contentEditorInstRef.current.setData(initialData.content || '');
      }
    }
  }, [initialData]);

  const syncNewsGallery = async (newsId, galleryImagesString) => {
    try {
      const existingRes = await api.get(`/news/${newsId}/gallery`);
      const existingImages = existingRes?.data || [];
      const targetPaths = galleryImagesString
        ? galleryImagesString.split(',').map(p => p.trim()).filter(Boolean)
        : [];

      // Identify images to delete
      const imagesToDelete = existingImages.filter(img => !targetPaths.includes(img.image_path));
      // Identify paths to add
      const pathsToAdd = targetPaths.filter(path => !existingImages.some(img => img.image_path === path));

      // Perform deletions and additions
      await Promise.all([
        ...imagesToDelete.map(img => api.del(`/news/gallery/${img.id}`)),
        ...pathsToAdd.map((path, idx) => api.post(`/news/${newsId}/gallery`, { image_path: path, sort_order: idx }))
      ]);
    } catch (err) {
      console.error('Error syncing news gallery:', err);
      throw new Error('Failed to sync gallery images');
    }
  };

  const onSubmit = async (data) => {
    try {
      if (postType === 'enquiry') {
        // Enquiry edit only — map form fields to backend fields
        const payload = {
          status: data.enquiry_status,
          assigned_to: data.assigned_to || null,
          follow_up_notes: data.follow_up_notes,
          response_date: data.response_date || null,
        };
        await api.put(`/enquiries/${initialData.id}`, payload);
        addToast('Enquiry updated successfully', 'success');
      } else {
        const apiPath = POST_API[postType] || '/press-releases';

        let attachmentPath = initialData?.attachment || '';
        if (data.attachment?.[0] instanceof File) {
          const uploaded = await uploadFile(data.attachment[0]);
          attachmentPath = uploaded?.path || uploaded?.filename || '';
        }

        // Build the payload mapping form fields to backend column names
        const payload = {};
        payload.title = data.title;
        payload.status = data.status === 'published' ? 'Published' : 'Draft';
        payload.featured = data.featured === 'yes';
        payload.seo_title = data.seo_title;
        payload.seo_keywords = data.seo_keywords;
        payload.seo_description = data.seo_description;
        payload.canonical_url = data.canonical_url;
        payload.tags = data.tags;

        if (postType === 'news') {
          payload.category_id = data.category ? Number(data.category) : null;
          payload.summary = data.excerpt;
          payload.full_content = data.content;
          payload.news_source = data.news_source;
          payload.author = data.author;
          payload.publish_date = data.publish_date || null;
          payload.featured_image = typeof data.featured_image === 'string' ? data.featured_image : featuredImagePreview || '';
        } else if (postType === 'event') {
          payload.event_type_id = data.category ? Number(data.category) : null;
          payload.short_description = data.excerpt;
          payload.description = data.content;
          payload.event_start_date = data.event_start_date || null;
          payload.event_end_date = data.event_end_date || null;
          payload.registration_start_date = data.reg_start_date || null;
          payload.registration_end_date = data.reg_end_date || null;
          payload.venue = data.venue;
          payload.address = data.address;
          payload.google_map_url = data.map_url;
          payload.organizer_name = data.organizer_name;
          payload.organizer_email = data.organizer_email;
          payload.organizer_contact = data.organizer_contact;
          payload.registration_link = data.registration_link;
          payload.maximum_participants = data.max_participants ? Number(data.max_participants) : null;
          payload.event_status = data.event_status;
          payload.publish_status = data.status === 'published' ? 'Published' : 'Draft';
          payload.banner_image = typeof data.featured_image === 'string' ? data.featured_image : featuredImagePreview || '';
        } else {
          // press-release
          payload.category_id = data.category ? Number(data.category) : null;
          payload.short_description = data.excerpt;
          payload.detailed_content = data.content;
          payload.publish_date = data.publish_date || null;
          payload.expiry_date = data.expiry_date || null;
          payload.featured_image = typeof data.featured_image === 'string' ? data.featured_image : featuredImagePreview || '';
          payload.attachment = attachmentPath;
        }

        if (isEdit) {
          await api.put(`${apiPath}/${initialData.id}`, payload);
          if (postType === 'news') {
            await syncNewsGallery(initialData.id, data.gallery_images);
          }
          addToast(`${postType} updated successfully`, 'success');
        } else {
          const res = await api.post(apiPath, payload);
          if (postType === 'news') {
            const newsId = res?.data?.id;
            if (newsId) {
              await syncNewsGallery(newsId, data.gallery_images);
            }
          }
          addToast(`${postType} created successfully`, 'success');
        }
      }
      router.push(postType === 'enquiry' ? '/enquiry' : `/posts/${postType}`);
    } catch (err) {
      addToast(err.message || 'Operation failed', 'danger');
    }
  };

  const taxonomyKey = postType === 'news'
    ? 'news-category'
    : postType === 'event'
      ? 'event-category'
      : 'press-release-category';

  const CATEGORIES = getTerms(taxonomyKey);

  const renderSeoConfigurations = () => (
    <div className="card" style={{ background: 'rgba(0, 0, 0, 0.01)', borderStyle: 'dashed' }}>
      <div className="card-header" style={{ padding: '12px 18px' }}>
        <h4 className="card-title" style={{ fontSize: '0.875rem' }}>SEO Configurations</h4>
      </div>
      <div className="card-body" style={{ padding: '18px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">SEO Title</label>
            <Input
              {...register('seo_title')}
              placeholder="Meta title for search engines"
            />
          </div>

          <div className="form-group">
            <label className="form-label">SEO Keywords</label>
            <Input
              {...register('seo_keywords')}
              placeholder="event, launch, workshop"
            />
          </div>

          <div className="form-group text-left md:col-span-2">
            <label className="form-label">SEO Description</label>
            <textarea
              {...register('seo_description')}
              className="form-textarea"
              placeholder="Meta description under 160 characters..."
              style={{ minHeight: '60px' }}
            />
          </div>

          <div className="form-group md:col-span-2">
            <label className="form-label">Canonical URL</label>
            <Input
              {...register('canonical_url')}
              placeholder="e.g. https://example.com/posts/my-post"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card max-w-5xl">
      <div className="card-header">
        <h3 className="card-title">{isEdit ? `Edit ${postType}` : `Create ${postType}`}</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
                    {postType === 'enquiry' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Enquiry ID</label>
                <Input value={initialData?.id || 'New'} disabled />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <Select {...register('enquiry_status')}>
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Responded">Responded</option>
                  <option value="Closed">Closed</option>
                </Select>
              </div>
              <div className="form-group">
                <label className="form-label">Name <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                <Input 
                  {...register('enquiry_name', { required: 'Name is required' })} 
                  placeholder="Enter your name"
                  className={errors.enquiry_name ? 'error' : ''} 
                />
                {errors.enquiry_name && <p className="form-error">{errors.enquiry_name.message}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <Input type="email" {...register('enquiry_email')} />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile</label>
                <Input {...register('enquiry_mobile')} placeholder="+91 234 567 8900" />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <Input {...register('enquiry_subject')} />
              </div>
              <div className="form-group md:col-span-2">
                <label className="form-label">Message</label>
                <textarea {...register('enquiry_message')} className="form-textarea" rows={4} />
              </div>
              <div className="form-group">
                <label className="form-label">Submitted Date</label>
                <Controller control={control} name="submitted_date" render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className="form-input w-full" wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />
              </div>
              <div className="form-group">
                <label className="form-label">Response Date</label>
                <Controller control={control} name="response_date" render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className="form-input w-full" wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />
              </div>
              <div className="form-group">
                <label className="form-label">Assigned To</label>
                <Input {...register('assigned_to')} placeholder="e.g. Sales Team" />
              </div>
              <div className="form-group md:col-span-2">
                <label className="form-label">Follow-up Notes</label>
                <textarea {...register('follow_up_notes')} className="form-textarea" rows={3} />
              </div>
              <div className="form-group md:col-span-2">
                <input
                  id="enquiry-attachment-input"
                  type="file"
                  {...attachmentRegister}
                  style={{ display: 'none' }}
                  onChange={(event) => {
                    attachmentRegister.onChange(event);
                    const file = event.target.files?.[0];
                    setEnquiryAttachmentName(file ? file.name : '');
                  }}
                />
                <label htmlFor="enquiry-attachment-input" className="premium-dropzone">
                  <ImagePlus size={24} className="premium-dropzone-icon" />
                  <span className="premium-dropzone-text">
                    {enquiryAttachmentName || 'Featured Image'}
                  </span>
                </label>
              </div>
              
              <div className="form-group md:col-span-2 pt-4 flex gap-4">
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push(postType === 'enquiry' ? '/enquiry' : `/posts/${postType}`)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Main Content Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">
                    {postType === 'event' ? 'Event Title' : postType === 'news' ? 'News Title' : 'Title'} <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <Input
                    {...register('title', { required: 'Title is required' })}
                    placeholder={postType === 'event' ? 'Event Title' : postType === 'news' ? 'News Title' : 'Press Release Title'}
                    className={errors.title ? 'error' : ''}
                  />
                  {errors.title && <p className="form-error">{errors.title.message}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Slug</label>
                  <Input
                    {...register('slug')}
                    placeholder="auto-generated-slug"
                    className={errors.slug ? 'error' : ''}
                  />
                  {errors.slug && <p className="form-error">{errors.slug.message}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {postType === 'event' ? 'Event Type' : postType === 'news' ? 'News Category' : 'Category'} {postType !== 'event' && <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>}
                  </label>
                  <Select {...register('category', postType === 'event' ? {} : { required: 'Category/Type is required' })}>
                    <option value="">Select type...</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </Select>
                  {errors.category && <p className="form-error">{errors.category.message}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <Input
                    {...register('tags')}
                    placeholder="news, launch, tech"
                  />
                </div>

                {postType === 'news' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">News Source</label>
                      <Input
                        {...register('news_source')}
                        placeholder="Reuters, AP, Internal"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Author</label>
                      <Input
                        {...register('author')}
                        placeholder="Enter your name"
                      />
                    </div>
                  </>
                )}
              </div>

              {postType === 'event' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">
                        Event Start Date <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>
                      </label>
                      <Controller control={control} name="event_start_date" rules={{ required: 'Event Start Date is required' }} render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className={`form-input w-full ${errors.event_start_date ? 'error' : ''}`} wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />
                      {errors.event_start_date && <p className="form-error">{errors.event_start_date.message}</p>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Event End Date <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>
                      </label>
                      <Controller control={control} name="event_end_date" rules={{ required: 'Event End Date is required' }} render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className={`form-input w-full ${errors.event_end_date ? 'error' : ''}`} wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />
                      {errors.event_end_date && <p className="form-error">{errors.event_end_date.message}</p>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Registration Start Date</label>
                      <Controller control={control} name="reg_start_date" render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className="form-input w-full" wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Registration End Date</label>
                      <Controller control={control} name="reg_end_date" render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className="form-input w-full" wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />
                    </div>

                    <div className="form-group md:col-span-2">
                      <label className="form-label">
                        Venue <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>
                      </label>
                      <Input
                        {...register('venue', { required: 'Venue is required' })}
                        placeholder="e.g. Conference Hall A"
                        className={errors.venue ? 'error' : ''}
                      />
                      {errors.venue && <p className="form-error">{errors.venue.message}</p>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Address</label>
                      <Input
                        {...register('address')}
                        placeholder="e.g. 123 Main St"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Google Map URL</label>
                      <Input
                        {...register('map_url')}
                        placeholder="https://maps.google.com/..."
                      />
                    </div>

                    <div className="form-group md:col-span-2">
                      <label className="form-label">Registration Link</label>
                      <Input
                        {...register('registration_link')}
                        placeholder="https://example.com/register"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Organizer Name</label>
                      <Input
                        {...register('organizer_name')}
                        placeholder="e.g. Acme Corp"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Organizer Email</label>
                      <Input
                        type="email"
                        {...register('organizer_email')}
                        placeholder="organizer@example.com"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Organizer Contact</label>
                      <Input
                        {...register('organizer_contact')}
                        placeholder="+91 234 567 8900"
                      />
                    </div>
                  </div>
                </>
              )}

              {postType !== 'event' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">
                      Publish Date <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>
                    </label>
                    <Controller control={control} name="publish_date" rules={{ required: 'Publish Date is required' }} render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className={`form-input w-full ${errors.publish_date ? 'error' : ''}`} wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />
                    {errors.publish_date && <p className="form-error">{errors.publish_date.message}</p>}
                  </div>

                  {postType !== 'news' && (
                    <div className="form-group">
                      <label className="form-label">Expiry Date</label>
                      <Controller control={control} name="expiry_date" render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className="form-input w-full" wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />
                    </div>
                  )}
                </div>
              )}

              {/* SEO Configurations */}
              {postType !== 'news' && renderSeoConfigurations()}
            </div>

            {/* Sidebar Controls */}
            <div className="space-y-4">
              {/* Publish Settings & Status */}
              {/* Publish Settings & Media */}
              <div className="card" style={{ background: 'var(--color-surface)', border: 'none' }}>
                <div className="card-body">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">{postType === 'event' ? 'Publish Status' : 'Status'}</label>
                      <Select {...register('status')}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </Select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">{postType === 'news' ? 'Featured News' : 'Featured'}</label>
                      <Select {...register('featured')}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </Select>
                    </div>

                    {postType === 'event' && (
                      <div className="form-group md:col-span-2">
                        <label className="form-label">Event Status</label>
                        <Select {...register('event_status')}>
                          <option value="Upcoming">Upcoming</option>
                          <option value="Ongoing">Ongoing</option>
                          <option value="Completed">Completed</option>
                        </Select>
                      </div>
                    )}

                    <div className="form-group">
                      <label className="form-label">
                        {postType === 'event' ? 'Banner Image' : 'Featured Image'} {postType !== 'event' && <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>}
                      </label>

                      {/* Hidden Input */}
                      <input
                        type="file"
                        accept="image/*"
                        ref={featuredImageInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFeaturedImageChange}
                      />

                      {/* Custom Dashed Image Upload Dropzone */}
                      <div
                        onClick={() => {
                          setMediaTarget('featured');
                          setIsMediaModalOpen(true);
                        }}
                        className="premium-dropzone"
                      >
                      {featuredImagePreview ? (
                        <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <img
                            src={featuredImagePreview}
                            alt="Featured Preview"
                            style={{ maxHeight: '80px', objectFit: 'contain', borderRadius: 'var(--radius-sm)', marginBottom: '8px' }}
                          />
                          <span className="premium-dropzone-text" style={{ fontSize: '0.70rem' }}>Change</span>
                        </div>
                      ) : (
                        <>
                          <ImagePlus size={24} className="premium-dropzone-icon" />
                          <span className="premium-dropzone-text">Featured Image</span>
                        </>
                      )}
                      </div>
                      {errors.featured_image && <p className="form-error">{errors.featured_image.message}</p>}
                    </div>

                    {postType === 'news' && (
                      <div className="form-group">
                        <label className="form-label">Gallery Images</label>

                        {/* Hidden Input */}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          ref={galleryImagesInputRef}
                          style={{ display: 'none' }}
                          onChange={handleGalleryImagesChange}
                        />

                        {/* Custom Dashed Image Upload Dropzone */}
                        <div
                          onClick={() => {
                            setMediaTarget('gallery');
                            setIsMediaModalOpen(true);
                          }}
                          className="premium-dropzone"
                        >
                          {galleryImagesPreviews.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '4px' }}>
                                {galleryImagesPreviews.slice(0, 3).map((url, i) => (
                                  <img
                                    key={i}
                                    src={url}
                                    alt={`Gallery Preview ${i}`}
                                    style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                                  />
                                ))}
                              </div>
                              <span className="premium-dropzone-text" style={{ fontSize: '0.70rem' }}>
                                {galleryImagesPreviews.length} images
                              </span>
                            </div>
                          ) : (
                            <>
                              <ImagePlus size={24} className="premium-dropzone-icon" />
                              <span className="premium-dropzone-text">Image Gallery</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {postType !== 'news' && postType !== 'event' && (
                      <div className="form-group md:col-span-2">
                        <label className="form-label">Attachment (PDF/Doc)</label>
                        <input
                          type="file"
                          id="attachment-input"
                          accept=".pdf,.doc,.docx"
                          {...attachmentRegister}
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            attachmentRegister.onChange(e);
                            const file = e.target.files?.[0];
                            if (file) {
                              const label = document.getElementById('attachment-label');
                              if (label) label.innerText = file.name;
                            }
                          }}
                        />
                        <div
                          onClick={() => document.getElementById('attachment-input').click()}
                          className="premium-dropzone"
                          style={{ minHeight: '80px' }}
                        >
                          <FileText size={24} className="premium-dropzone-icon" />
                          <span id="attachment-label" className="premium-dropzone-text">
                            {initialData?.attachment ? initialData.attachment.split('/').pop() : 'Click to select document'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary & Content */}
              <div className="card" style={{ background: 'var(--color-surface)', border: 'none' }}>
                <div className="card-body">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">
                        {postType === 'event' ? 'Short Description' : postType === 'news' ? 'Summary' : 'Short Description'} <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>
                      </label>
                      <div className="ck-editor-wrapper">
                        <div ref={summaryEditorRef} />
                      </div>
                      {errors.excerpt && <p className="form-error">{errors.excerpt.message}</p>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        {postType === 'event' ? 'Event Description' : postType === 'news' ? 'Full Content' : 'Detailed Content'} <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>
                      </label>
                      <div className="ck-editor-wrapper">
                        <div ref={contentEditorRef} />
                      </div>
                      {errors.content && <p className="form-error">{errors.content.message}</p>}
                    </div>
                  </div>
                </div>
              </div>


              {/* SEO & Action Buttons */}
              {postType === 'news' && renderSeoConfigurations()}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  style={{ width: 'auto', minWidth: '72px', padding: '9px 18px' }}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push(postType === 'enquiry' ? '/enquiry' : `/posts/${postType}`)}
                  style={{ width: 'auto', minWidth: '84px', padding: '9px 18px' }}
                >
                  Cancel
                </Button>
              </div>
            </div>

          </div>
          )}
        </form>
      </div>

      <MediaSelectModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleMediaModalSelect}
        multiple={mediaTarget === 'gallery'}
      />
    </div>
  );
}
