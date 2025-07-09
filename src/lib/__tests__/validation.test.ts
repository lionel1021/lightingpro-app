import { validateRequest, sanitizeInput, ProductSearchSchema } from '../validation'

describe('Validation utilities', () => {
  describe('sanitizeInput', () => {
    it('removes dangerous HTML brackets', () => {
      const input = '<script>alert("xss")</script>Hello World'
      const result = sanitizeInput(input)
      expect(result).toBe('scriptalert("xss")/scriptHello World')
      expect(result).not.toContain('<')
      expect(result).not.toContain('>')
    })

    it('preserves safe text content', () => {
      const input = 'LED Light Bulb - 60W Equivalent'
      const result = sanitizeInput(input)
      expect(result).toBe('LED Light Bulb - 60W Equivalent')
    })

    it('handles empty strings', () => {
      const result = sanitizeInput('')
      expect(result).toBe('')
    })

    it('removes JavaScript protocols', () => {
      const input = "javascript:alert('xss')"
      const result = sanitizeInput(input)
      expect(result).not.toContain('javascript:')
    })

    it('trims whitespace', () => {
      const input = "  hello world  "
      const result = sanitizeInput(input)
      expect(result).toBe('hello world')
    })
  })

  describe('validateRequest with ProductSearchSchema', () => {
    it('validates correct search data', () => {
      const validData = {
        query: 'LED light',
        category: 'ceiling-lights',
        brand: 'Philips',
        price_min: 10,
        price_max: 100,
        page: 1,
        limit: 20
      }

      const result = validateRequest(ProductSearchSchema, validData)
      expect(result.success).toBe(true)
      expect(result.data).toEqual(validData)
    })

    it('handles missing optional fields', () => {
      const minimalData = {
        query: 'LED light', // query is required
        page: 1,
        limit: 10
      }

      const result = validateRequest(ProductSearchSchema, minimalData)
      expect(result.success).toBe(true)
      expect(result.data.page).toBe(1)
      expect(result.data.limit).toBe(10)
    })

    it('rejects invalid page numbers', () => {
      const invalidData = {
        query: 'LED light',
        page: 0, // Page should be >= 1
        limit: 10
      }

      const result = validateRequest(ProductSearchSchema, invalidData)
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
    })

    it('accepts valid price ranges', () => {
      const validData = {
        query: 'LED light',
        price_min: 50,
        price_max: 100,
        page: 1,
        limit: 10
      }

      const result = validateRequest(ProductSearchSchema, validData)
      expect(result.success).toBe(true)
    })

    it('limits query string length', () => {
      const longQuery = 'a'.repeat(150) // Longer than max 100
      const data = {
        query: longQuery,
        page: 1,
        limit: 10
      }

      const result = validateRequest(ProductSearchSchema, data)
      expect(result.success).toBe(false)
    })

    it('validates limit boundaries', () => {
      const tooHighLimit = {
        query: 'LED light',
        page: 1,
        limit: 100 // Should be limited to max 50
      }

      const result = validateRequest(ProductSearchSchema, tooHighLimit)
      expect(result.success).toBe(false)
    })
  })
})