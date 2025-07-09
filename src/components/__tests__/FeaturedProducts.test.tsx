import { render, screen } from '@testing-library/react'
import { FeaturedProducts } from '../FeaturedProducts'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('FeaturedProducts', () => {
  it('renders featured products correctly', () => {
    render(<FeaturedProducts />)
    
    // Check if products are rendered
    expect(screen.getByText('Philips Hue Play HDMI Sync Box + 2 Bulbs')).toBeInTheDocument()
    expect(screen.getByText('West Elm Sculptural Glass Globe Pendant')).toBeInTheDocument()
    expect(screen.getByText('Govee Immersion WiFi TV LED Strip 55-65"')).toBeInTheDocument()
    expect(screen.getByText('Article Cerno Brass Table Lamp')).toBeInTheDocument()
  })

  it('displays product prices correctly', () => {
    render(<FeaturedProducts />)
    
    expect(screen.getByText('$199.99')).toBeInTheDocument()
    expect(screen.getByText('$149.99')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByText('$279.99')).toBeInTheDocument()
  })

  it('shows Hot badges for hot products', () => {
    render(<FeaturedProducts />)
    
    const hotBadges = screen.getAllByText('🔥 Hot')
    expect(hotBadges).toHaveLength(2) // Only 2 products are marked as hot
  })

  it('displays product ratings', () => {
    render(<FeaturedProducts />)
    
    expect(screen.getByText('4.9')).toBeInTheDocument()
    expect(screen.getByText('4.7')).toBeInTheDocument()
    expect(screen.getByText('4.8')).toBeInTheDocument()
    expect(screen.getByText('4.6')).toBeInTheDocument()
  })

  it('has View Details links for all products', () => {
    render(<FeaturedProducts />)
    
    const viewDetailsLinks = screen.getAllByText('View Details')
    expect(viewDetailsLinks).toHaveLength(4)
    
    // Check if links have correct href attributes
    expect(viewDetailsLinks[0].closest('a')).toHaveAttribute('href', '/products/1')
    expect(viewDetailsLinks[1].closest('a')).toHaveAttribute('href', '/products/2')
  })

  it('displays product brands correctly', () => {
    render(<FeaturedProducts />)
    
    expect(screen.getByText('Philips')).toBeInTheDocument()
    expect(screen.getByText('West Elm')).toBeInTheDocument()
    expect(screen.getByText('Govee')).toBeInTheDocument()
    expect(screen.getByText('Article')).toBeInTheDocument()
  })

  it('handles image loading errors gracefully', () => {
    render(<FeaturedProducts />)
    
    // Find all product images
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(4)
    
    // All images should have alt text
    images.forEach(img => {
      expect(img).toHaveAttribute('alt')
    })
  })
})