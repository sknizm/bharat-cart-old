// // components/ui/toast.tsx
// 'use client';

// import * as React from "react";
// import { Toast, Toaster } from "@/components/ui/toaster";
// import { useToast } from "@/components/ui/use-toast";

// export function ToasterProvider() {
//   const { toast } = useToast();
//   return <Toaster />;
// }

// export function useToast() {
//   const [toasts, setToasts] = React.useState<Toast[]>([]);

//   const toast = (newToast: Toast) => {
//     setToasts((current) => [...current, newToast]);
//     setTimeout(() => {
//       setToasts((current) => current.slice(1));
//     }, 3000);
//   };

//   return { toast };
// }

// export type Toast = {
//   title: string;
//   description?: string;
// };