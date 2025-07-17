// // src/components/ReasonsToLove.tsx
// export default function ReasonsToLove() {
//     const features = [
//       {
//         title: "Easy & Smart",
//         desc: "Your customers don’t have to download apps or sign up to buy from you.",
//         points: ["100% web based, no app!", "No user accounts required"],
//         icon: "📱",
//       },
//       {
//         title: "Built-in Marketing",
//         desc: "We’re a marketing engine to grow your customer list & market to them.",
//         points: [
//           "Capture customer numbers & emails to build your database",
//           "Retarget your customers with SMS & marketing tools",
//         ],
//         icon: "📣",
//       },
//       {
//         title: "Flexible Payments",
//         desc: "Customers can pay by debit cards, credit cards, UPI & wallets.",
//         icon: "💳",
//       },
//       {
//         title: "Delivery integration",
//         desc:
//           "Don’t have your own delivery staff? We’ve integrated with leading delivery service providers.",
//         icon: "🚚",
//       },
//     ];
  
//     return (
//       <section className="py-20 bg-white text-center" id="reasons">
//         <h2 className="text-3xl font-bold text-orange-500 mb-8">
//           Reasons to love <span className="text-black">AirMenus</span>
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto px-4">
//           {features.map((feature, i) => (
//             <div key={i} className="flex flex-col items-center">
//               <div className="text-4xl mb-4">{feature.icon}</div>
//               <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
//               <p className="text-gray-600 mb-2">{feature.desc}</p>
//               {feature.points?.length > 0 && (
//                 <ul className="text-left text-sm text-blue-800 space-y-1">
//                   {feature.points.map((point, idx) => (
//                     <li key={idx} className="flex items-start gap-2">
//                       <span className="text-blue-600">✔️</span>
//                       {point}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           ))}
//         </div>
//       </section>
//     );
//   }
  