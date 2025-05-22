
const testimonials = [
  {
    quote: "Athlete GPT has completely transformed my training. The personalized plans adjust perfectly to my schedule and recovery needs.",
    author: "Sarah J.",
    role: "Professional Runner"
  },
  {
    quote: "As a coach, I can now manage my entire team more effectively. The AI suggestions have helped us improve performance across the board.",
    author: "Ebenezer G.",
    role: "Volleyball Coach"
  },
  {
    quote: "The nutrition planning alone is worth it. I've seen dramatic improvements in my energy levels and recovery times.",
    author: "David K.",
    role: "CrossFit Enthusiast"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how Athlete GPT is helping athletes and fitness enthusiasts reach their goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm"
            >
              <div className="mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-athleteGreen-500">★</span>
                ))}
              </div>
              <blockquote className="text-gray-700 mb-6">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-gray-600 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
