# The Rustic Spoon - Setup Guide

## 🍽️ Restaurant Website Features

Your restaurant website now includes:
- ✅ Multi-page structure (Home, Menu, About, Contact/Reservations)
- ✅ **Google Sheets Integration** for reservation system
- ✅ **Enhanced menu** with 6 dishes per category (was 4)
- ✅ **Advanced animations** throughout the site
- ✅ Responsive design for all devices
- ✅ Interactive forms with validation

---

## 🔗 Google Sheets Integration Setup

### Step 1: Create Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Restaurant Reservations"

### Step 2: Set Up Headers
In the first row, add these headers:
- Name
- Email
- Phone
- Guests
- Date
- Time
- Occasion
- Special Requests
- Timestamp

### Step 3: Add Google Apps Script
1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code
3. Copy the code from `google-apps-script.txt` file
4. Paste it into the script editor
5. Save the script (Ctrl+S or Cmd+S)

### Step 4: Deploy as Web App
1. Click **Deploy > New deployment**
2. Select type: **Web app**
3. Fill in the details:
   - Description: "Reservation Form"
   - Execute as: "Me"
   - Who has access: "Anyone"
4. Click **Deploy**
5. **Copy the Web App URL** (it will look like: `https://script.google.com/macros/s/.../exec`)

### Step 5: Update Your Website
1. Open `script.js` in your website folder
2. Find this line:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Replace it with your actual Web App URL:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ACTUAL_URL/exec';
   ```

### Step 6: Test the Integration
1. Open your website in a browser
2. Go to the Reservations page
3. Fill out the form and submit
4. Check your Google Sheet - the reservation should appear!

---

## 🍴 Menu Updates

Each category now has **6 dishes** instead of 4:

### Starters (6 items)
1. Bruschetta Classica - $12
2. Butternut Squash Soup - $14
3. Crispy Calamari - $16
4. Caprese Salad - $15
5. **Stuffed Mushrooms - $13** (NEW)
6. **Shrimp Cocktail - $18** (NEW)

### Main Courses (6 items)
1. Pan-Seared Salmon - $32
2. Grilled Ribeye Steak - $45
3. Truffle Mushroom Pizza - $24
4. Homemade Pappardelle - $28
5. **Grilled Lamb Chops - $38** (NEW)
6. **Seasonal Vegetable Risotto - $26** (NEW)

### Desserts (6 items)
1. Classic Tiramisu - $12
2. New York Cheesecake - $11
3. Crème Brûlée - $13
4. Artisan Ice Cream - $9
5. **Chocolate Lava Cake - $14** (NEW)
6. **Seasonal Fruit Tart - $12** (NEW)

### Drinks (6 items)
1. House Red Wine - $12
2. Signature Cocktails - $14
3. Artisan Coffee - $5
4. Fresh Pressed Juices - $8
5. **Local Craft Beer - $9** (NEW)
6. **Artisan Sparkling Water - $6** (NEW)

---

## ✨ New Animations Added

### Scroll Animations
- **Fade In Up** - Elements slide up and fade in
- **Scale In** - Elements grow and fade in
- **Fade In Left/Right** - Elements slide from sides
- **Staggered delays** - Elements animate sequentially

### Interactive Animations
- **Hover effects** - Cards pulse on hover
- **Button bounce** - Buttons bounce when clicked
- **Magnetic buttons** - Reserve button follows cursor
- **Parallax scrolling** - Hero background moves with scroll

### Progress Features
- **Scroll progress bar** - Shows reading progress at top
- **Loading states** - Form submission shows loading spinner
- **Enhanced notifications** - Better feedback animations

---

## 🎨 Customization Options

### Change Colors
Edit `styles.css` and modify these variables:
```css
:root {
    --primary-color: #8B4513;    /* Main brown color */
    --secondary-color: #654321;  /* Darker brown */
    --accent-color: #D2691E;     /* Orange accent */
    --gold-color: #DAA520;       /* Gold color */
}
```

### Update Restaurant Info
Replace in each HTML file:
- Restaurant name in logo
- Contact information
- Address and phone numbers
- Social media links

### Add Your Own Images
Replace Unsplash URLs with your own food photos:
```html
<img src="your-image.jpg" alt="Dish Name">
```

---

## 📱 Testing Checklist

### Functionality
- [ ] Navigation works between all pages
- [ ] Mobile menu opens/closes correctly
- [ ] Menu category tabs switch properly
- [ ] Reservation form validates inputs
- [ ] Google Sheets integration works
- [ ] Contact form submits successfully
- [ ] Newsletter subscription works

### Design
- [ ] Hero section displays correctly
- [ ] All images load properly
- [ ] Animations play smoothly
- [ ] Responsive design works on mobile
- [ ] Scroll progress bar appears
- [ ] Hover effects work on all cards

### Performance
- [ ] Page loads quickly
- [ ] No console errors
- [ ] Forms submit without errors
- [ ] Images load with fade-in effect

---

## 🔧 Troubleshooting

### Google Sheets Not Working
1. Make sure the Web App is deployed as "Anyone" can access
2. Check that the URL in script.js matches exactly
3. Ensure the Google Sheet has the correct headers
4. Try re-deploying the Web App

### Animations Not Playing
1. Check browser console for JavaScript errors
2. Ensure all CSS files are linked properly
3. Verify that script.js is loaded after HTML content

### Images Not Loading
1. Check your internet connection (Unsplash images need internet)
2. Replace with local images if needed
3. Check image URLs are correct

---

## 🚀 Next Steps

1. **Set up Google Sheets integration** using the guide above
2. **Customize content** with your actual restaurant information
3. **Replace images** with your own food photography
4. **Test thoroughly** on different devices and browsers
5. **Deploy** to your web hosting service

---

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all file paths are correct
3. Ensure all files are in the same directory
4. Test with different browsers (Chrome, Firefox, Safari)

Enjoy your beautiful restaurant website! 🎉