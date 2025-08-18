-- Insert the existing products from the website into the products table
INSERT INTO public.products (name, category, description, storage_requirements, certifications, physical_specs, nutritional_info, is_active) VALUES
(
  'Okra',
  'Vegetables',
  'Fresh tender okra pods, perfect for international markets.',
  'Cool dry storage',
  ARRAY['ACIR Certified'],
  '{"season": "Year-round", "origin": "Mashonaland East", "moq": "500kg"}',
  '{"fiber": "high", "vitamins": ["A", "C", "K"]}',
  true
),
(
  'Sweet Potatoes',
  'Roots & Tubers',
  'Orange-fleshed sweet potatoes rich in beta-carotene.',
  'Cool dry storage',
  ARRAY['FDA Approved'],
  '{"season": "Mar-Aug", "origin": "Manicaland", "moq": "1000kg"}',
  '{"beta_carotene": "high", "fiber": "high", "potassium": "high"}',
  true
),
(
  'Collard Greens',
  'Leafy Greens',
  'Nutrient-dense leafy greens, pesticide-free cultivation.',
  'Refrigerated storage',
  ARRAY['ACIR Certified'],
  '{"season": "Year-round", "origin": "Mashonaland Central", "moq": "250kg"}',
  '{"calcium": "high", "iron": "high", "vitamins": ["A", "C", "K"]}',
  true
),
(
  'Baby Corn',
  'Vegetables',
  'Tender baby corn, hand-picked at optimal maturity.',
  'Refrigerated storage',
  ARRAY['FDA Approved'],
  '{"season": "Oct-Apr", "origin": "Masvingo", "moq": "300kg"}',
  '{"fiber": "medium", "folate": "medium"}',
  true
),
(
  'Butternut Squash',
  'Vegetables',
  'Premium butternut squash with extended shelf life.',
  'Cool dry storage',
  ARRAY['ACIR Certified'],
  '{"season": "Apr-Sep", "origin": "Midlands", "moq": "800kg"}',
  '{"vitamin_a": "very_high", "fiber": "high", "potassium": "medium"}',
  true
),
(
  'Passion Fruit',
  'Fruits',
  'Aromatic passion fruit with high pulp content.',
  'Cool storage',
  ARRAY['FDA Approved'],
  '{"season": "Dec-Jun", "origin": "Eastern Highlands", "moq": "200kg"}',
  '{"vitamin_c": "very_high", "fiber": "high", "antioxidants": "high"}',
  true
),
(
  'Bird''s Eye Chilli',
  'Vegetables',
  'Fiery small chillies perfect for spice lovers and culinary use.',
  'Dry storage',
  ARRAY['ACIR Certified'],
  '{"season": "Year-round", "origin": "Mashonaland West", "moq": "100kg"}',
  '{"capsaicin": "very_high", "vitamin_c": "high"}',
  true
),
(
  'Mange Tout',
  'Vegetables',
  'Tender snow peas with edible pods, crisp and sweet.',
  'Refrigerated storage',
  ARRAY['FDA Approved'],
  '{"season": "May-Oct", "origin": "Masvingo", "moq": "250kg"}',
  '{"protein": "medium", "fiber": "medium", "vitamin_c": "high"}',
  true
),
(
  'Fine Beans',
  'Vegetables',
  'Premium thin green beans with excellent texture and flavor.',
  'Refrigerated storage',
  ARRAY['ACIR Certified'],
  '{"season": "Apr-Nov", "origin": "Midlands", "moq": "300kg"}',
  '{"fiber": "high", "folate": "high", "vitamin_k": "high"}',
  true
),
(
  'Sugar Snap Peas',
  'Vegetables',
  'Sweet, crunchy pea pods perfect for fresh consumption.',
  'Refrigerated storage',
  ARRAY['FDA Approved'],
  '{"season": "Jun-Sep", "origin": "Manicaland", "moq": "200kg"}',
  '{"protein": "medium", "fiber": "high", "vitamin_c": "high"}',
  true
);