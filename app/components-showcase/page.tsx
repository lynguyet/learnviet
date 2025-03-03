'use client';

import Button from '../components/Button';

export default function ComponentsShowcase() {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Components Showcase</h1>

      {/* Buttons Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <div className="space-y-4">
            <div className="space-x-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
            </div>
            
            <div className="space-x-4">
              <Button variant="primary" disabled>Disabled Primary</Button>
              <Button variant="secondary" disabled>Disabled Secondary</Button>
              <Button variant="outline" disabled>Disabled Outline</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Colors Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-primary">
            <p className="text-white">Primary</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-100">
            <p className="text-gray-900">Secondary</p>
          </div>
          <div className="p-4 rounded-lg border border-gray-200">
            <p className="text-gray-900">Outline</p>
          </div>
        </div>
      </section>

      {/* Typography Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Typography</h2>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Heading 1</h1>
          <h2 className="text-3xl font-bold">Heading 2</h2>
          <h3 className="text-2xl font-bold">Heading 3</h3>
          <p className="text-base">Regular paragraph text</p>
          <p className="text-sm">Small text</p>
          <p className="text-xs">Extra small text</p>
        </div>
      </section>

      {/* Add more component sections as needed */}
    </div>
  );
}