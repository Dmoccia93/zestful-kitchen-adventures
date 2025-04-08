
const testimonials = [
  {
    quote: "Zestful Kitchen changed how I approach cooking. I save money and eat better meals!",
    author: "Sarah J.",
    role: "Busy Parent"
  },
  {
    quote: "The ingredient-based recipes are a game-changer. I waste less food and try new dishes.",
    author: "Michael T.",
    role: "Home Cook"
  },
  {
    quote: "Weekly meal plans make healthy eating so much easier. Delicious and nutritious!",
    author: "Amelia P.",
    role: "Fitness Enthusiast"
  }
];

const TestimonialSection = () => {
  return (
    <section className="py-16 px-6 sm:px-8 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">
          What Our Users Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="p-6 rounded-xl border border-border bg-muted animate-fade-in flex flex-col"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <p className="text-lg italic mb-4 flex-grow">"{testimonial.quote}"</p>
              <div>
                <p className="font-bold text-foreground">{testimonial.author}</p>
                <p className="text-muted-foreground text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
