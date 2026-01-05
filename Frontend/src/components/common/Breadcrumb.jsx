import React from 'react'
import { Home } from 'lucide-react'
import { Link } from 'react-router'

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
    <Link to="/">
      <Home size={16} className="text-gray-400" />
    </Link>
    {items.map((item, idx) => (
      <React.Fragment key={idx}>
        <span className="text-gray-400">/</span>
        <span className={idx === items.length - 1 ? 'text-gray-900 font-semibold' : 'text-gray-600'}>
          {item}
        </span>
      </React.Fragment>
    ))}
  </nav>
)

export default Breadcrumb