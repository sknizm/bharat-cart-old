'use client';

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { Input } from '@/components/ui/input';
import { Search, Filter, MoreVertical, Eye, Edit, Copy, Trash2 } from 'lucide-react';

type Website = {
  id: string;
  name: string;
  type: 'customer' | 'draft' | 'template';
  previewImage: string;
  lastUpdated: string;
  status: 'active' | 'inactive' | 'archived';
};

const WebsitesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'customer' | 'draft' | 'template'>('all');

  // Sample website data
  const websites: Website[] = [
    {
      id: '1',
      name: 'Acme Corp',
      type: 'customer',
      previewImage: 'https://placehold.co/600x400/2563eb/white?text=Acme+Corp',
      lastUpdated: '2023-06-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Beta Solutions',
      type: 'customer',
      previewImage: 'https://placehold.co/600x400/2563eb/white?text=Beta+Sol',
      lastUpdated: '2023-06-10',
      status: 'active'
    },
    {
      id: '3',
      name: 'Summer Campaign',
      type: 'draft',
      previewImage: 'https://placehold.co/600x400/f59e0b/white?text=Summer',
      lastUpdated: '2023-06-12',
      status: 'inactive'
    },
    {
      id: '4',
      name: 'E-commerce Template',
      type: 'template',
      previewImage: 'https://placehold.co/600x400/10b981/white?text=E-com',
      lastUpdated: '2023-05-28',
      status: 'active'
    },
    {
      id: '5',
      name: 'Portfolio Draft',
      type: 'draft',
      previewImage: 'https://placehold.co/600x400/f59e0b/white?text=Portfolio',
      lastUpdated: '2023-06-08',
      status: 'inactive'
    },
    {
      id: '6',
      name: 'Restaurant Template',
      type: 'template',
      previewImage: 'https://placehold.co/600x400/10b981/white?text=Restaurant',
      lastUpdated: '2023-05-20',
      status: 'active'
    },
    {
      id: '7',
      name: 'XYZ Consulting',
      type: 'customer',
      previewImage: 'https://placehold.co/600x400/2563eb/white?text=XYZ',
      lastUpdated: '2023-06-05',
      status: 'archived'
    },
    {
      id: '8',
      name: 'Blog Template',
      type: 'template',
      previewImage: 'https://placehold.co/600x400/10b981/white?text=Blog',
      lastUpdated: '2023-05-15',
      status: 'active'
    },
  ];

  const filteredWebsites = websites.filter(website => {
    const matchesSearch = website.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || website.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'customer': return <Badge variant="default">Customer-owned</Badge>;
      case 'draft': return <Badge variant="secondary">Draft</Badge>;
      case 'template': return <Badge variant="outline">Template</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="default">Active</Badge>;
      case 'inactive': return <Badge variant="secondary">Inactive</Badge>;
      case 'archived': return <Badge variant="destructive">Archived</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Websites</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search websites..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="pl-3">
                    <Filter className="h-4 w-4 mr-2" />
                    {filterType === 'all' ? 'All Types' : 
                     filterType === 'customer' ? 'Customer-owned' :
                     filterType === 'draft' ? 'Drafts' : 'Templates'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterType('all')}>
                    All Types
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType('customer')}>
                    Customer-owned
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType('draft')}>
                    Drafts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType('template')}>
                    Templates
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className="whitespace-nowrap">
                + New Website
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredWebsites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 mb-4">No websites found</div>
              <Button>Create New Website</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredWebsites.map((website) => (
                <Card key={website.id} className="hover:shadow-md transition-shadow">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={website.previewImage}
                      alt={`Preview of ${website.name}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(website.status)}
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-none tracking-tight line-clamp-1">
                        {website.name}
                      </h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {website.type === 'template' && (
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Use as Template
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTypeBadge(website.type)}
                    </div>
                  </CardHeader>
                  <CardFooter className="text-sm text-gray-500">
                    Updated: {website.lastUpdated}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsitesPage;