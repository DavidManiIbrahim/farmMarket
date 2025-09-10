import { useEffect, useState, lazy, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { uploadProductImage } from '@/lib/image-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
const CalendarLazy = lazy(() => import('@/components/ui/calendar').then(m => ({ default: m.Calendar })));
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { Package, Trash2, Edit, Plus, Leaf, DollarSign, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  category_id?: string;
  price: number;
  unit: string;
  stock_quantity: number;
  image_url?: string | null;
  is_organic: boolean;
  harvest_date?: string;
  location: string;
  is_available: boolean;
  created_at: string;
}

const FarmerProducts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [harvestDate, setHarvestDate] = useState<Date | undefined>();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    unit: 'kg',
    stock_quantity: '',
    is_organic: false,
    location: ''
  });

  const units = [
    'lb',
    'kg',
    'piece',
    'bunch',
    'bag',
    'pint',
    'quart',
    'dozen',
    'oz'
  ];

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      category_id: product.category_id || '',
      price: product.price.toString(),
      unit: product.unit || 'kg',
      stock_quantity: product.stock_quantity.toString(),
      is_organic: product.is_organic || false,
      location: product.location || ''
    });
    if (product.harvest_date) {
      setHarvestDate(new Date(product.harvest_date));
    }
    setEditDialogOpen(true);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const fetchProducts = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('farmer_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts((data as any) || []);
    } catch (e) {
      console.error('Error loading products', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_available: !product.is_available })
        .eq('id', product.id);
      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_available: !p.is_available } : p));
    } catch (e) {
      console.error('Error updating availability', e);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (e) {
      console.error('Error deleting product', e);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingProduct) return;

    setLoading(true);

    try {
      // If a file was selected, upload to Supabase Storage and get public URL
      let uploadedImageUrl: string | null = null;
      if (imageFile) {
        try {
          uploadedImageUrl = await uploadProductImage(imageFile, user.id, supabase);
        } catch (error: any) {
          toast({
            title: "Image Upload Error",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
      }

      // Get the selected category name for the category text field
      const selectedCategory = categories.find(cat => cat.id === formData.category_id);

      const updateData = {
        name: formData.name,
        description: formData.description,
        category: selectedCategory?.name || '',
        category_id: formData.category_id,
        price: parseFloat(formData.price),
        unit: formData.unit,
        stock_quantity: parseInt(formData.stock_quantity),
        is_organic: formData.is_organic,
        harvest_date: harvestDate?.toISOString(),
        location: formData.location,
        ...(uploadedImageUrl && { image_url: uploadedImageUrl })
      };

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', editingProduct.id)
        .eq('farmer_id', user.id);

      if (error) throw error;

      // Update the products list with the updated product
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...updateData, image_url: uploadedImageUrl || p.image_url }
          : p
      ));

      toast({
        title: "Product Updated!",
        description: "Your product has been successfully updated."
      });

      setEditDialogOpen(false);
      setImageFile(null);
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Products</h1>
          <p className="text-muted-foreground">Manage the products you have created</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Products</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No products listed yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-foreground">{product.name}</h3>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => toggleAvailability(product)}>
                            <Badge variant={product.is_available ? 'default' : 'secondary'}>
                              {product.is_available ? 'Live' : 'Hidden'}
                            </Badge>
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleEditClick(product)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteProduct(product.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      {product.image_url && (
                        <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover rounded mb-2" />
                      )}
                      <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Category:</span> {product.category}</p>
                        <p><span className="font-medium">Price:</span> ${product.price}/{product.unit}</p>
                        <p><span className="font-medium">Stock:</span> {product.stock_quantity} {product.unit}</p>
                        <p><span className="font-medium">Location:</span> {product.location}</p>
                        {product.is_organic && (
                          <Badge variant="secondary" className="text-xs">Organic</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Fresh Tomatoes"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category_id} 
                    onValueChange={(value) => handleInputChange('category_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your product..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Price *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select 
                    value={formData.unit} 
                    onValueChange={(value) => handleInputChange('unit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map(unit => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Harvest Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !harvestDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {harvestDate ? format(harvestDate, "PPP") : "Pick harvest date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Suspense fallback={<div className="p-3 text-sm text-muted-foreground">Loading calendar...</div>}>
                        <CalendarLazy
                          mode="single"
                          selected={harvestDate}
                          onSelect={setHarvestDate}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </Suspense>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Farmville, CA"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_file">Update Product Image</Label>
                <Input
                  id="image_file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);
                  }}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="organic"
                  checked={formData.is_organic}
                  onCheckedChange={(checked) => handleInputChange('is_organic', checked)}
                />
                <Label htmlFor="organic" className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-agricultural-green" />
                  Organic Product
                </Label>
              </div>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Updating Product...' : 'Update Product'}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default FarmerProducts;


