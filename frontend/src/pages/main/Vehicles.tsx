import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ChevronRight, ShieldCheck } from 'lucide-react';
import Navbar from '../../components/main/layout/Navbar';
import Footer from '../../components/main/layout/Footer';
import Card from '../../components/main/ui/Card';
import Button from '../../components/main/ui/Button';
import axios from 'axios';

const Vehicles: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: ''
  });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: ''
    });
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/vehicle/all');
        const approvedVehicles = response.data.filter(
          (vehicle: any) => vehicle.approval_status === 'Approved'
        );
        setVehicles(approvedVehicles);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8 animate-slide-down">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vehicles</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
              Browse our collection of quality vehicles from verified sellers
            </p>
          </div>

          <Button
            variant="outline"
            onClick={toggleFilter}
            icon={<Filter className="h-5 w-5" />}
          >
            Filters
          </Button>
        </div>

        {isFilterOpen && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 animate-slide-down">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input
                type="text"
                placeholder="Brand"
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
              />
              <input
                type="number"
                placeholder="Min Price"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
              />
              <input
                type="number"
                placeholder="Max Price"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
              />
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="outline" className="mr-3" onClick={resetFilters}>
                Reset
              </Button>
              <Button>
                Apply Filters
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm px-4 py-3 mb-8 animate-fade-in">
          <p className="text-gray-600 dark:text-gray-300 mb-2 sm:mb-0">
            {loading ? 'Loading results...' : `Showing ${filteredVehicles.length} results`}
          </p>
          <div className="flex items-center">
            <span className="text-gray-600 dark:text-gray-300 mr-2">Sort by:</span>
            <select className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {!loading && filteredVehicles.map((vehicle: any, index: number) => (
            <Card
              key={vehicle.ad_id}
              className="h-full animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              hoverEffect={true}
              onClick={() => window.location.href = `/details/${vehicle.ad_id}`}
            >
              <div className="relative h-36 overflow-hidden rounded-t-xl">
                <img
                  src={vehicle.images[0]}
                  alt={vehicle.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {/* Removed badges from here */}
              </div>
              
              <div className="p-4">
                {/* Badges container before title */}
                <div className="flex space-x-2 mb-2">
                  {vehicle.item_condition && (
                    <span className="bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded">
                      {vehicle.item_condition}
                    </span>
                  )}
                  {vehicle.selling_status && (
                    <span className="bg-green-600 text-white text-xs font-medium px-2 py-0.5 rounded">
                      {vehicle.selling_status}
                    </span>
                  )}
                  <span className="bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded flex items-center">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Verified
                  </span>
                </div>

                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{vehicle.title}</h3>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>{vehicle.made_year}</span>
                  <span>{Number(vehicle.mileage).toLocaleString()} km</span>
                </div>
                <p className="text-blue-600 dark:text-blue-400 font-bold text-base mb-2">Rs. {Number(vehicle.price).toLocaleString()}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-2">{vehicle.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>{vehicle.city}, {vehicle.province}</span>
                  <Link to={`/details/${vehicle.ad_id}`} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center">
                    Details <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Vehicles;
