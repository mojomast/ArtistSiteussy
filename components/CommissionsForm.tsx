'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppContext } from './ClientWrapper'

interface CommissionFormData {
  name: string
  email: string
  phone: string
  commissionType: string
  description: string
  budget: string
  timeline: string
}

export function CommissionsForm() {
  const { commissions, locale } = useAppContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CommissionFormData>()

  const onSubmit = async (data: CommissionFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/commissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setIsSubmitted(true)
        reset()
      } else {
        console.error('Failed to submit commission request')
      }
    } catch (error) {
      console.error('Error submitting commission request:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const commissionTypes = commissions ? commissions[`commission_types_${locale}` as keyof typeof commissions] as any[] : []
  const title = commissions ? commissions[`title_${locale}` as keyof typeof commissions] as string : (locale === 'en' ? 'Commission Request' : 'Demande de commission')
  const subtitle = commissions ? commissions[`subtitle_${locale}` as keyof typeof commissions] as string : ''
  const description = commissions ? commissions[`description_${locale}` as keyof typeof commissions] as string : ''

  if (isSubmitted) {
    return (
      <section id="commissions" className="section-padding bg-theme-primary">
        <div className="container-max text-center">
          <div className="bg-theme-secondary rounded-lg p-12 max-w-2xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-theme-accent mb-6">
              {locale === 'en' ? 'Thank You!' : 'Merci !'}
            </h2>
            <p className="text-theme-text text-lg mb-6">
              {locale === 'en' ? "Your commission request has been submitted successfully. I'll get back to you within 24-48 hours." : "Votre demande de commission a été soumise avec succès. Je vous répondrai dans les 24-48 heures."}
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="btn-primary"
            >
              {locale === 'en' ? 'Submit Another Request' : 'Soumettre une autre demande'}
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="commissions" className="section-padding bg-theme-primary">
      <div className="container-max">
        <h2 className="text-3xl font-heading font-bold text-theme-accent mb-8 text-center">
          {title}
        </h2>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl font-heading font-semibold text-theme-accent mb-4">
              {subtitle}
            </h3>
            <p className="text-theme-text">
              {description}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="bg-theme-secondary rounded-lg p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-theme-text mb-2">
                  {locale === 'en' ? 'Full Name *' : 'Nom complet *'}
                </label>
                <input
                  {...register('name', { required: locale === 'en' ? 'Name is required' : 'Le nom est requis' })}
                  type="text"
                  id="name"
                  className="w-full bg-theme-primary border border-theme-secondary rounded px-4 py-2 text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-theme-text mb-2">
                  {locale === 'en' ? 'Email *' : 'Courriel *'}
                </label>
                <input
                  {...register('email', {
                    required: locale === 'en' ? 'Email is required' : 'Le courriel est requis',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: locale === 'en' ? 'Invalid email address' : 'Adresse courriel invalide'
                    }
                  })}
                  type="email"
                  id="email"
                  className="w-full bg-theme-primary border border-theme-secondary rounded px-4 py-2 text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className="block text-theme-text mb-2">
                {locale === 'en' ? 'Phone Number' : 'Numéro de téléphone'}
              </label>
              <input
                {...register('phone')}
                type="tel"
                id="phone"
                className="w-full bg-theme-primary border border-theme-secondary rounded px-4 py-2 text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="commissionType" className="block text-theme-text mb-2">
                {locale === 'en' ? 'Commission Type *' : 'Type de commission *'}
              </label>
              <select
                {...register('commissionType', { required: locale === 'en' ? 'Please select a commission type' : 'Veuillez sélectionner un type de commission' })}
                id="commissionType"
                className="w-full bg-theme-primary border border-theme-secondary rounded px-4 py-2 text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
              >
                <option value="">{locale === 'en' ? 'Select a type' : 'Sélectionnez un type'}</option>
                {commissionTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              {errors.commissionType && (
                <p className="text-red-400 text-sm mt-1">{errors.commissionType.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-theme-text mb-2">
                {locale === 'en' ? 'Project Description *' : 'Description du projet *'}
              </label>
              <textarea
                {...register('description', { required: locale === 'en' ? 'Description is required' : 'La description est requise' })}
                id="description"
                rows={4}
                className="w-full bg-theme-primary border border-theme-secondary rounded px-4 py-2 text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                placeholder={locale === 'en' ? 'Describe your vision for this commission...' : 'Décrivez votre vision pour cette commission...'}
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label htmlFor="budget" className="block text-theme-text mb-2">
                  {locale === 'en' ? 'Budget Range' : 'Gamme de budget'}
                </label>
                <select
                  {...register('budget')}
                  id="budget"
                  className="w-full bg-theme-primary border border-theme-secondary rounded px-4 py-2 text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                >
                  <option value="">{locale === 'en' ? 'Select budget range' : 'Sélectionnez la gamme de budget'}</option>
                  <option value="500-1000">$500 - $1,000</option>
                  <option value="1000-2500">$1,000 - $2,500</option>
                  <option value="2500-5000">$2,500 - $5,000</option>
                  <option value="5000+">$5,000+</option>
                </select>
              </div>

              <div>
                <label htmlFor="timeline" className="block text-theme-text mb-2">
                  {locale === 'en' ? 'Preferred Timeline' : 'Délai préféré'}
                </label>
                <select
                  {...register('timeline')}
                  id="timeline"
                  className="w-full bg-theme-primary border border-theme-secondary rounded px-4 py-2 text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                >
                  <option value="">{locale === 'en' ? 'Select timeline' : 'Sélectionnez le délai'}</option>
                  <option value="1-2-weeks">{locale === 'en' ? '1-2 weeks' : '1-2 semaines'}</option>
                  <option value="2-4-weeks">{locale === 'en' ? '2-4 weeks' : '2-4 semaines'}</option>
                  <option value="1-2-months">{locale === 'en' ? '1-2 months' : '1-2 mois'}</option>
                  <option value="flexible">{locale === 'en' ? 'Flexible' : 'Flexible'}</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (locale === 'en' ? 'Submitting...' : 'Soumission...') : (locale === 'en' ? 'Submit Commission Request' : 'Soumettre la demande de commission')}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}