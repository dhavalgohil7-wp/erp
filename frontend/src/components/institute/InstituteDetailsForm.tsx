import React, { useState, useRef } from 'react'
import { useInstituteStore } from '../../store/useInstituteStore'

export default function InstituteDetailsForm() {
  const { instituteDetails, updateInstituteDetails, addToast } = useInstituteStore()

  const [formData, setFormData] = useState({
    name: instituteDetails.name,
    address: instituteDetails.address,
    email: instituteDetails.email,
    phone: instituteDetails.phone,
    website: instituteDetails.website || '',
    affiliationCode: instituteDetails.affiliationCode || '',
  })

  const [logoPreview, setLogoPreview] = useState<string>(instituteDetails.logoUrl)
  const [bannerPreview, setBannerPreview] = useState<string>(instituteDetails.bannerUrl)

  const [logoError, setLogoError] = useState<string | null>(null)
  const [bannerError, setBannerError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const logoInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  // Handle Logo Upload (Must be 200 x 200 px, Max 2MB, Valid Image)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError(null)
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setLogoError('Invalid file type! Please upload a JPG, PNG, or WebP image.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setLogoError('File size exceeds 2MB limit.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      const img = new Image()
      img.onload = () => {
        if (img.naturalWidth !== 200 || img.naturalHeight !== 200) {
          setLogoError(
            `Dimensions must be exactly 200 × 200 px. Uploaded image is ${img.naturalWidth} × ${img.naturalHeight} px.`
          )
        } else {
          setLogoPreview(dataUrl)
          setLogoError(null)
          addToast({
            title: 'Logo validated successfully',
            description: '200 × 200 px exact dimensions verified.',
            type: 'success',
          })
        }
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  // Helper to auto-resize/crop any image to exact 200 x 200 px for testing convenience
  const handleAutoFitLogo = (file?: File) => {
    const targetFile = file || logoInputRef.current?.files?.[0]
    if (!targetFile) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 200
        canvas.height = 200
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, 200, 200)
          const fittedUrl = canvas.toDataURL('image/png')
          setLogoPreview(fittedUrl)
          setLogoError(null)
          addToast({
            title: 'Logo Auto-Fitted',
            description: 'Image smoothly scaled to exact 200 × 200 px dimensions.',
            type: 'info',
          })
        }
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(targetFile)
  }

  // Handle Banner Upload (Must be 300 x 70 px, Max 2MB, Valid Image)
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBannerError(null)
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setBannerError('Invalid file type! Please upload a JPG, PNG, or WebP image.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setBannerError('File size exceeds 2MB limit.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      const img = new Image()
      img.onload = () => {
        if (img.naturalWidth !== 300 || img.naturalHeight !== 70) {
          setBannerError(
            `Dimensions must be exactly 300 × 70 px. Uploaded image is ${img.naturalWidth} × ${img.naturalHeight} px.`
          )
        } else {
          setBannerPreview(dataUrl)
          setBannerError(null)
          addToast({
            title: 'Banner validated successfully',
            description: '300 × 70 px exact dimensions verified.',
            type: 'success',
          })
        }
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  // Helper to auto-fit banner to 300 x 70 px for testing convenience
  const handleAutoFitBanner = (file?: File) => {
    const targetFile = file || bannerInputRef.current?.files?.[0]
    if (!targetFile) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 300
        canvas.height = 70
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, 300, 70)
          const fittedUrl = canvas.toDataURL('image/png')
          setBannerPreview(fittedUrl)
          setBannerError(null)
          addToast({
            title: 'Banner Auto-Fitted',
            description: 'Image smoothly scaled to exact 300 × 70 px dimensions.',
            type: 'info',
          })
        }
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(targetFile)
  }

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = 'Institute name is required.'
    if (!formData.address.trim()) errors.address = 'Institute address is required.'

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email format.'
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.'
    } else if (formData.phone.trim().length < 6) {
      errors.phone = 'Phone number is too short.'
    }

    if (!logoPreview) {
      errors.logo = 'Institute logo is required.'
    }
    if (!bannerPreview) {
      errors.banner = 'Institute banner logo is required.'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      addToast({
        title: 'Validation Failed',
        description: 'Please correct the highlighted form errors before saving.',
        type: 'error',
      })
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      updateInstituteDetails({
        name: formData.name.trim(),
        address: formData.address.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        website: formData.website.trim(),
        affiliationCode: formData.affiliationCode.trim(),
        logoUrl: logoPreview,
        bannerUrl: bannerPreview,
      })
      setIsSubmitting(false)
      addToast({
        title: 'Institute Details Saved',
        description: 'Record updated and persisted successfully to tenant storage.',
        type: 'success',
      })
    }, 400)
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg border border-outline-variant/30 shadow-sm animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-space-sm mb-space-md border-b border-surface-container">
        <div>
          <h2 className="text-headline-sm text-on-surface font-bold flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[15px]">
              <i className="fa-solid fa-school"></i>
            </span>
            1.1 Institute Details
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Primary organizational identity, official contacts, and validated branding graphics.
          </p>
        </div>
        <span className="text-[12px] px-3 py-1 bg-tertiary-fixed/40 text-tertiary font-semibold rounded-full border border-tertiary/20">
          <i className="fa-solid fa-check-double mr-1"></i> Auto-Persisted to Storage
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Name & Affiliation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div>
            <label className="block text-[13px] font-semibold text-on-surface mb-1">
              Institute Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. St. Xavier International Academy"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[14px] border ${
                formErrors.name ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-outline-variant/30 focus:border-primary'
              } outline-none transition-all`}
            />
            {formErrors.name && <p className="text-red-500 text-[12px] mt-1">{formErrors.name}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-on-surface mb-1">
              Affiliation / Registration Code
            </label>
            <input
              type="text"
              value={formData.affiliationCode}
              onChange={(e) => setFormData({ ...formData, affiliationCode: e.target.value })}
              placeholder="e.g. CBSE-REG-847291"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[14px] border border-outline-variant/30 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* Row 2: Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div>
            <label className="block text-[13px] font-semibold text-on-surface mb-1">
              Official Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <i className="fa-solid fa-envelope absolute left-3.5 top-3 text-secondary text-[14px]"></i>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@institute.edu.in"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[14px] border ${
                  formErrors.email ? 'border-red-500' : 'border-outline-variant/30 focus:border-primary'
                } outline-none transition-all`}
              />
            </div>
            {formErrors.email && <p className="text-red-500 text-[12px] mt-1">{formErrors.email}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-on-surface mb-1">
              Primary Phone No <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <i className="fa-solid fa-phone absolute left-3.5 top-3 text-secondary text-[14px]"></i>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 79 2840 9100"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[14px] border ${
                  formErrors.phone ? 'border-red-500' : 'border-outline-variant/30 focus:border-primary'
                } outline-none transition-all`}
              />
            </div>
            {formErrors.phone && <p className="text-red-500 text-[12px] mt-1">{formErrors.phone}</p>}
          </div>
        </div>

        {/* Row 3: Address */}
        <div>
          <label className="block text-[13px] font-semibold text-on-surface mb-1">
            Physical Campus Address <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Complete street address, district, state and postal code..."
            className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[14px] border ${
              formErrors.address ? 'border-red-500' : 'border-outline-variant/30 focus:border-primary'
            } outline-none transition-all resize-none`}
          />
          {formErrors.address && <p className="text-red-500 text-[12px] mt-1">{formErrors.address}</p>}
        </div>

        {/* Row 4: Image Uploads (Exact Dimensions Specs) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md pt-2 border-t border-surface-container">
          {/* 1. Logo (200 x 200 px) */}
          <div className="p-space-md rounded-xl bg-surface-container-low/60 border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13.5px] font-bold text-on-surface flex items-center gap-2">
                  <i className="fa-solid fa-image text-primary"></i> Institute Logo
                  <span className="text-red-500">*</span>
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-primary-fixed text-primary border border-primary/20">
                  Exact: 200 × 200 px
                </span>
              </div>
              <p className="text-[12px] text-on-surface-variant mb-3">
                Displayed in profile cards, ID badges, and report headers. Max 2MB (PNG, JPG, WebP).
              </p>

              <div className="flex items-center gap-4">
                <div className="w-[100px] h-[100px] rounded-xl bg-white border border-outline-variant/40 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs relative">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-secondary text-xs p-2">
                      <i className="fa-solid fa-cloud-arrow-up text-[20px] mb-1 block"></i>
                      No Logo
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  <input
                    type="file"
                    ref={logoInputRef}
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <div className="flex flex-wrap gap-2">
                    <label
                      htmlFor="logo-upload"
                      className="btn-secondary text-xs py-1.5 px-3 cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-arrow-up-from-bracket"></i> Select 200×200
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAutoFitLogo()}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-surface-container-highest hover:bg-surface-container text-on-surface border border-outline-variant/30"
                      title="Automatically crop and scale any uploaded picture into exactly 200 x 200 px"
                    >
                      <i className="fa-solid fa-crop-simple mr-1 text-primary"></i> Auto-Fit 200px
                    </button>
                  </div>
                  <span className="text-[11px] text-secondary">
                    Validation: exact 200x200 pixel check enforced
                  </span>
                </div>
              </div>

              {logoError && (
                <div className="mt-3 p-2.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center justify-between border border-red-200">
                  <span>
                    <i className="fa-solid fa-triangle-exclamation mr-1.5"></i>
                    {logoError}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAutoFitLogo()}
                    className="font-bold underline ml-2 hover:text-red-900"
                  >
                    Auto-Fit
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 2. Banner Logo (300 x 70 px) */}
          <div className="p-space-md rounded-xl bg-surface-container-low/60 border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13.5px] font-bold text-on-surface flex items-center gap-2">
                  <i className="fa-solid fa-panorama text-tertiary"></i> Banner Logo
                  <span className="text-red-500">*</span>
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-tertiary-fixed text-tertiary border border-tertiary/20">
                  Exact: 300 × 70 px
                </span>
              </div>
              <p className="text-[12px] text-on-surface-variant mb-3">
                Used on institutional letterheads, invoices, and login portals. Max 2MB.
              </p>

              <div className="flex flex-col gap-3">
                <div className="w-full max-w-[300px] h-[70px] rounded-lg bg-white border border-outline-variant/40 flex items-center justify-center overflow-hidden shadow-xs relative">
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-secondary text-xs">
                      <i className="fa-solid fa-panorama mr-1.5"></i> 300 × 70 px Preview
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    ref={bannerInputRef}
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                    id="banner-upload"
                  />
                  <label
                    htmlFor="banner-upload"
                    className="btn-secondary text-xs py-1.5 px-3 cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-arrow-up-from-bracket"></i> Select 300×70
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAutoFitBanner()}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-surface-container-highest hover:bg-surface-container text-on-surface border border-outline-variant/30"
                    title="Automatically crop and scale picture into exactly 300 x 70 px"
                  >
                    <i className="fa-solid fa-crop-simple mr-1 text-tertiary"></i> Auto-Fit 300×70
                  </button>
                </div>
              </div>

              {bannerError && (
                <div className="mt-3 p-2.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center justify-between border border-red-200">
                  <span>
                    <i className="fa-solid fa-triangle-exclamation mr-1.5"></i>
                    {bannerError}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAutoFitBanner()}
                    className="font-bold underline ml-2 hover:text-red-900"
                  >
                    Auto-Fit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4 border-t border-surface-container">
          <span className="text-[12.5px] text-secondary">
            <i className="fa-solid fa-circle-info mr-1.5"></i>
            All changes are validated according to the institutional multi-tenant specification.
          </span>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary text-sm px-6 py-2.5 font-semibold flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner animate-spin"></i> Saving...
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk"></i> Submit & Save Institute
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
