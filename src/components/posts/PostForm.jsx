'use client';

import React from 'react';
import { useForm } from 'react-hook-form';


import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import { useTerms } from '@/context/TermsContext';

export function PostForm({ initialData, postType }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const { addToast } = useToast();
  const { getTerms } = useTerms();

  const {
    register,
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

  const postTitle = watch('title');
  const editorRef = React.useRef(null);

  React.useEffect(() => {
    register('content', { 
      required: postType === 'event' ? 'Event Description is required' : postType === 'news' ? 'Full Content is required' : 'Detailed Content is required' 
    });
  }, [register, postType]);

  React.useEffect(() => {
    if (editorRef.current && initialData?.content) {
      editorRef.current.innerHTML = initialData.content;
    }
  }, [initialData]);

  React.useEffect(() => {
    if (!isEdit && postTitle !== undefined) {
      const generatedSlug = postTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', generatedSlug, { shouldDirty: true, shouldValidate: true });
    }
  }, [postTitle, setValue, isEdit]);

  const handleFormat = (e, command) => {
    e.preventDefault();
    document.execCommand(command, false, null);
    if (editorRef.current) {
      setValue('content', editorRef.current.innerHTML, { shouldDirty: true, shouldValidate: true });
    }
  };

  const onSubmit = async (data) => {
    try {
      // Mock network delay
      await new Promise(res => setTimeout(res, 500));

      if (isEdit) {
        addToast(`${postType} updated successfully (mock)`, 'success');
      } else {
        addToast(`${postType} created successfully (mock)`, 'success');
      }
      router.push(`/posts/${postType}`);
    } catch (err) {
      addToast(err.message || 'Operation failed', 'danger');
    }
  };

  const taxonomyKey = postType === 'news'
    ? 'news-category'
    : postType === 'event'
    ? 'event-category'
    : 'press-release-category';

  const CATEGORIES = getTerms(taxonomyKey).map((t) => t.name);

  return (
    <div className="card max-w-5xl">
      <div className="card-header">
        <h3 className="card-title">{isEdit ? `Edit ${postType}` : `Create ${postType}`}</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Content Form Fields */}
            <div className="lg:col-span-2 space-y-4">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">
                    {postType === 'event' ? 'Event Type' : postType === 'news' ? 'News Category' : 'Category'} {postType !== 'event' && <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>}
                  </label>
                  <Select {...register('category', postType === 'event' ? {} : { required: 'Category/Type is required' })}>
                    <option value="">Select type...</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
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
              </div>

              {postType === 'news' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      placeholder="e.g. John Doe"
                    />
                  </div>
                </div>
              )}

              {postType === 'event' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">
                        Event Start Date <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>
                      </label>
                      <Input
                        type="date"
                        {...register('event_start_date', { required: 'Event Start Date is required' })}
                        className={errors.event_start_date ? 'error' : ''}
                      />
                      {errors.event_start_date && <p className="form-error">{errors.event_start_date.message}</p>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Event End Date <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>
                      </label>
                      <Input
                        type="date"
                        {...register('event_end_date', { required: 'Event End Date is required' })}
                        className={errors.event_end_date ? 'error' : ''}
                      />
                      {errors.event_end_date && <p className="form-error">{errors.event_end_date.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Registration Start Date</label>
                      <Input
                        type="date"
                        {...register('reg_start_date')}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Registration End Date</label>
                      <Input
                        type="date"
                        {...register('reg_end_date')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Google Map URL</label>
                      <Input
                        {...register('map_url')}
                        placeholder="https://maps.google.com/..."
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Registration Link</label>
                      <Input
                        {...register('registration_link')}
                        placeholder="https://example.com/register"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        placeholder="+1 234 567 8900"
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
                    <Input
                      type="date"
                      {...register('publish_date', { required: 'Publish Date is required' })}
                      className={errors.publish_date ? 'error' : ''}
                    />
                    {errors.publish_date && <p className="form-error">{errors.publish_date.message}</p>}
                  </div>

                  {postType !== 'news' && (
                    <div className="form-group">
                      <label className="form-label">Expiry Date</label>
                      <Input
                        type="date"
                        {...register('expiry_date')}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">
                    {postType === 'event' ? 'Banner Image' : 'Featured Image'} {postType !== 'event' && <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>}
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    {...register('featured_image', (isEdit || postType === 'event') ? {} : { required: 'Featured Image is required' })}
                    style={{ padding: '7px 14px' }}
                    className={errors.featured_image ? 'error' : ''}
                  />
                  {errors.featured_image && <p className="form-error">{errors.featured_image.message}</p>}
                </div>

                {postType === 'news' ? (
                  <div className="form-group">
                    <label className="form-label">Gallery Images</label>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      {...register('gallery_images')}
                      style={{ padding: '7px 14px' }}
                    />
                  </div>
                ) : postType === 'event' ? (
                  <div className="form-group">
                    <label className="form-label">Maximum Participants</label>
                    <Input
                      type="number"
                      {...register('max_participants')}
                      placeholder="e.g. 150"
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label">Attachment (PDF/Doc)</label>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      {...register('attachment')}
                      style={{ padding: '7px 14px' }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  {postType === 'event' ? 'Short Description' : postType === 'news' ? 'Summary' : 'Short Description'} <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <textarea
                  {...register('excerpt', { required: 'Short Description is required' })}
                  className={`form-textarea ${errors.excerpt ? 'error' : ''}`}
                  placeholder={postType === 'news' ? 'Brief summary of the news...' : postType === 'event' ? 'Brief description of the event...' : 'Summarize the event/post briefly...'}
                  style={{ minHeight: '60px' }}
                />
                {errors.excerpt && <p className="form-error">{errors.excerpt.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  {postType === 'event' ? 'Event Description' : postType === 'news' ? 'Full Content' : 'Detailed Content (Rich Text Editor)'} <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                {/* Working WYSIWYG Editor Toolbar */}
                <div className="flex flex-wrap gap-1 p-2 border border-b-0 rounded-t-md" style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                  <button type="button" className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '11px' }} onMouseDown={(e) => handleFormat(e, 'bold')}><b>B</b></button>
                  <button type="button" className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '11px' }} onMouseDown={(e) => handleFormat(e, 'italic')}><i>I</i></button>
                  <button type="button" className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '11px' }} onMouseDown={(e) => handleFormat(e, 'underline')}><u>U</u></button>
                  <button type="button" className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '11px' }} onMouseDown={(e) => handleFormat(e, 'strikeThrough')}><s>S</s></button>
                  <span style={{ borderLeft: '1px solid var(--color-border)', margin: '0 4px' }} />
                  <button type="button" className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '11px' }} onMouseDown={(e) => handleFormat(e, 'insertUnorderedList')}>• List</button>
                  <button type="button" className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '11px' }} onMouseDown={(e) => handleFormat(e, 'insertOrderedList')}>1. List</button>
                  <span style={{ borderLeft: '1px solid var(--color-border)', margin: '0 4px' }} />
                  <button type="button" className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '11px' }} onMouseDown={(e) => handleFormat(e, 'undo')}>Undo</button>
                  <button type="button" className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '11px' }} onMouseDown={(e) => handleFormat(e, 'redo')}>Redo</button>
                </div>
                <div
                  id="rich-text-editor"
                  ref={editorRef}
                  contentEditable
                  className={`form-textarea ${errors.content ? 'error' : ''}`}
                  placeholder="Write the complete details..."
                  style={{ 
                    minHeight: '220px', 
                    borderTopLeftRadius: 0, 
                    borderTopRightRadius: 0,
                    outline: 'none',
                    overflowY: 'auto',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    padding: '12px'
                  }}
                  onInput={(e) => {
                    setValue('content', e.currentTarget.innerHTML, { shouldDirty: true, shouldValidate: true });
                  }}
                />
                {errors.content && <p className="form-error">{errors.content.message}</p>}
              </div>

              {/* SEO Configurations */}
              <div className="card" style={{ background: 'rgba(0, 0, 0, 0.01)', borderStyle: 'dashed' }}>
                <div className="card-header" style={{ padding: '12px 18px' }}>
                  <h4 className="card-title" style={{ fontSize: '0.875rem' }}>SEO Configurations</h4>
                </div>
                <div className="card-body" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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

                  <div className="form-group text-left">
                    <label className="form-label">SEO Description</label>
                    <textarea
                      {...register('seo_description')}
                      className="form-textarea"
                      placeholder="Meta description under 160 characters..."
                      style={{ minHeight: '60px' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Controls */}
            <div className="space-y-4">
              <div className="card" style={{ background: 'var(--color-surface)', border: 'none' }}>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">{postType === 'event' ? 'Publish Status' : 'Status'}</label>
                    <Select {...register('status')}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </Select>
                  </div>

                  {postType === 'event' && (
                    <div className="form-group">
                      <label className="form-label">Event Status</label>
                      <Select {...register('event_status')}>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </Select>
                    </div>
                  )}

                  {postType !== 'event' && (
                    <div className="form-group">
                      <label className="form-label">{postType === 'news' ? 'Featured News' : 'Featured'}</label>
                      <Select {...register('featured')}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </Select>
                    </div>
                  )}

                  <div className="pt-2 flex flex-col gap-2">
                    <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Save Post'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      className="w-full" 
                      onClick={() => router.push(`/posts/${postType}`)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
