const fs = require('fs');
let code = fs.readFileSync('src/components/posts/PostForm.jsx', 'utf8');

const targetStr = '<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">';
const enquiryFields = `          {postType === 'enquiry' ? (
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
                <Input {...register('enquiry_name', { required: 'Name is required' })} className={errors.enquiry_name ? 'error' : ''} />
                {errors.enquiry_name && <p className="form-error">{errors.enquiry_name.message}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <Input type="email" {...register('enquiry_email')} />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile</label>
                <Input {...register('enquiry_mobile')} />
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
                <Input type="date" {...register('submitted_date')} />
              </div>
              <div className="form-group">
                <label className="form-label">Response Date</label>
                <Input type="date" {...register('response_date')} />
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
                <label className="form-label">Attachment (Optional)</label>
                <Input type="file" {...register('attachment')} />
              </div>
              
              <div className="form-group md:col-span-2 pt-4 flex gap-4">
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push(\`/posts/\${postType}\`)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">`;

if (code.includes(targetStr) && !code.includes("postType === 'enquiry'")) {
  code = code.replace(targetStr, enquiryFields);
  console.log('Replaced top');
}

const targetEndStr = `          </div>
        </form>
      </div>

      <MediaSelectModal`;

if (code.includes(targetEndStr)) {
  code = code.replace(targetEndStr, `          </div>
          )}
        </form>
      </div>

      <MediaSelectModal`);
  console.log('Replaced bottom');
}

fs.writeFileSync('src/components/posts/PostForm.jsx', code);
