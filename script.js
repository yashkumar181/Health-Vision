
document.addEventListener('DOMContentLoaded', function() {
  // Mobile Navigation
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger) {
      hamburger.addEventListener('click', function() {
          navLinks.classList.toggle('active');
      });
  }

  // How It Works Animation
  const steps = document.querySelectorAll('.step');
  
  function checkIfInView() {
      steps.forEach((step, index) => {
          const rect = step.getBoundingClientRect();
          const isInView = (
              rect.top >= 0 &&
              rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
          );
          
          if (isInView) {
              setTimeout(() => {
                  step.classList.add('animated');
              }, index * 200); // Staggered animation
          }
      });
  }
  
  // Check on load and scroll
  checkIfInView();
  window.addEventListener('scroll', checkIfInView);
  
  // Image Upload Functionality
  const uploadContainer = document.getElementById('upload-container');
  const imageUpload = document.getElementById('image-upload');
  const previewContainer = document.getElementById('preview-container');
  const imagePreview = document.getElementById('image-preview');
  const removeImage = document.getElementById('remove-image');
  
  if (uploadContainer && imageUpload) {
      uploadContainer.addEventListener('click', function() {
          imageUpload.click();
      });
      
      uploadContainer.addEventListener('dragover', function(e) {
          e.preventDefault();
          uploadContainer.classList.add('dragover');
      });
      
      uploadContainer.addEventListener('dragleave', function() {
          uploadContainer.classList.remove('dragover');
      });
      
      uploadContainer.addEventListener('drop', function(e) {
          e.preventDefault();
          uploadContainer.classList.remove('dragover');
          
          if (e.dataTransfer.files.length) {
              imageUpload.files = e.dataTransfer.files;
              displayPreview(e.dataTransfer.files[0]);
          }
      });
      
      imageUpload.addEventListener('change', function() {
          if (this.files.length) {
              displayPreview(this.files[0]);
          }
      });
      
      if (removeImage) {
          removeImage.addEventListener('click', function() {
              imageUpload.value = '';
              uploadContainer.style.display = 'block';
              previewContainer.style.display = 'none';
          });
      }
  }
  
  function displayPreview(file) {
      if (!file.type.match('image.*')) {
          alert('Please select an image file');
          return;
      }
      
      const reader = new FileReader();
      
      reader.onload = function(e) {
          imagePreview.src = e.target.result;
          uploadContainer.style.display = 'none';
          previewContainer.style.display = 'block';
      };
      
      reader.readAsDataURL(file);
  }
  
  // Add symptom tags to textarea
  window.addSymptom = function(symptom) {
      const symptomsText = document.getElementById('symptoms-text');
      if (symptomsText) {
          if (symptomsText.value) {
              symptomsText.value += ', ' + symptom;
          } else {
              symptomsText.value = symptom;
          }
      }
  };
  
  // Analyze button functionality
  const analyzeBtn = document.getElementById('analyze-btn');
  const resultsPlaceholder = document.getElementById('results-placeholder');
  const resultsContent = document.getElementById('results-content');
  const loading = document.getElementById('loading');
  const potentialConditions = document.getElementById('potential-conditions');
  
  if (analyzeBtn) {
      analyzeBtn.addEventListener('click', function() {
          const symptomsText = document.getElementById('symptoms-text').value;
          const hasImage = previewContainer.style.display === 'block';
          
          if (!symptomsText && !hasImage) {
              alert('Please enter symptoms or upload an image');
              return;
          }
          
          // Show loading
          resultsPlaceholder.style.display = 'none';
          resultsContent.style.display = 'none';
          loading.style.display = 'flex';
          
          // Simulate API call with timeout
          setTimeout(function() {
              loading.style.display = 'none';
              resultsContent.style.display = 'block';
              
              // Generate mock results based on input
              generateMockResults(symptomsText, hasImage);
          }, 2000);
      });
  }
  
  function generateMockResults(symptoms, hasImage) {
      // Clear previous results
      potentialConditions.innerHTML = '';
      
      // Parse symptoms
      let symptomsList = [];
      if (symptoms) {
          symptomsList = symptoms.split(',').map(s => s.trim()).filter(s => s);
      }
      
      // Generate conditions based on symptoms or image
      const conditions = [];
      
      if (symptomsList.includes('Fever') && symptomsList.includes('Rash')) {
          conditions.push({
              name: 'Lyme Disease',
              probability: 'High (85%)',
              details: 'An infectious disease caused by bacteria transmitted by ticks.',
              symptoms: ['Fever', 'Rash', 'Fatigue', 'Joint Pain'],
              color: '#4caf50'
          });
      }
      
      if (symptomsList.includes('Joint Pain') && symptomsList.includes('Fatigue')) {
          conditions.push({
              name: 'Rheumatoid Arthritis',
              probability: 'Medium (65%)',
              details: 'An autoimmune disorder that causes inflammation in the joints.',
              symptoms: ['Joint Pain', 'Fatigue', 'Stiffness', 'Swelling'],
              color: '#ff9800'
          });
      }
      
      if (symptomsList.includes('Headache')) {
          conditions.push({
              name: 'Migraine',
              probability: 'Medium (60%)',
              details: 'A neurological condition characterized by severe headaches.',
              symptoms: ['Headache', 'Nausea', 'Light Sensitivity'],
              color: '#ff9800'
          });
      }
      
      if (hasImage) {
          conditions.push({
              name: 'Dermatitis Herpetiformis',
              probability: 'High (90%)',
              details: 'A rare skin condition associated with celiac disease.',
              symptoms: ['Rash', 'Itching', 'Blisters'],
              color: '#4caf50'
          });
      }
      
      // If no specific conditions match, add some generic ones
      if (conditions.length === 0) {
          conditions.push({
              name: 'Common Cold',
              probability: 'Low (30%)',
              details: 'A viral infection of the upper respiratory tract.',
              symptoms: ['Cough', 'Runny Nose', 'Sore Throat'],
              color: '#f44336'
          });
          
          conditions.push({
              name: 'Seasonal Allergies',
              probability: 'Low (25%)',
              details: 'An immune response to environmental triggers like pollen.',
              symptoms: ['Sneezing', 'Itchy Eyes', 'Congestion'],
              color: '#f44336'
          });
      }
      
      // Render conditions
      conditions.forEach(condition => {
          const conditionEl = document.createElement('div');
          conditionEl.className = 'condition';
          conditionEl.style.borderLeftColor = condition.color;
          
          conditionEl.innerHTML = `
              <div class="condition-header">
                  <div class="condition-name">${condition.name}</div>
                  <div class="condition-probability" style="background-color: ${condition.color}">${condition.probability}</div>
              </div>
              <div class="condition-details">${condition.details}</div>
              <div class="condition-symptoms">
                  Matching symptoms: ${condition.symptoms.map(s => <span>${s}</span>).join('')}
              </div>
          `;
          
          potentialConditions.appendChild(conditionEl);
      });
  }
  
  // Testimonial slider
  const dots = document.querySelectorAll('.dot');
  const testimonials = document.querySelectorAll('.testimonial');
  
  if (dots.length && testimonials.length) {
      dots.forEach((dot, index) => {
          dot.addEventListener('click', function() {
              // Hide all testimonials
              testimonials.forEach(t => {
                  t.style.display = 'none';
              });
              
              // Remove active class from all dots
              dots.forEach(d => {
                  d.classList.remove('active');
              });
              
              // Show selected testimonial and activate dot
              testimonials[index].style.display = 'block';
              dot.classList.add('active');
          });
      });
      
      // Initialize first testimonial
      testimonials[0].style.display = 'block';
      dots[0].classList.add('active');
  }
  
  // Form submission
  const signupForm = document.getElementById('signup-form');
  
  if (signupForm) {
      signupForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const name = document.getElementById('name').value;
          const email = document.getElementById('email').value;
          
          alert(`Thank you, ${name}! We'll send more information to ${email} shortly.`);
          signupForm.reset();
      });
  }
  
  // Download report functionality
  const downloadReport = document.getElementById('download-report');
  
  if (downloadReport) {
      downloadReport.addEventListener('click', function() {
          alert('Report download functionality would be implemented here in a real application.');
      });
  }
});
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});
