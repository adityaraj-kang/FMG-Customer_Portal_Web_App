import { createBrowserRouter, Navigate } from "react-router";
import { Root }                        from "./components/Root";
import { SplashScreen }                from "./components/SplashScreen";
import { OnboardingScreen }            from "./components/OnboardingScreen";
import { LoginScreen }                 from "./components/LoginScreen";
import { HomeLayout }                  from "./components/HomeLayout";
import { HomeScreen }                  from "./components/HomeScreen";
import { ServicesScreen }              from "./components/ServicesScreen";
import { ServiceDetailScreen }         from "./components/ServiceDetailScreen";
import { ActivityScreen }              from "./components/ActivityScreen";
import { ProfileScreen }               from "./components/ProfileScreen";
import { ChatScreen }                  from "./components/ChatScreen";
import { ChatConversationScreen }      from "./components/ChatConversationScreen";
import { AddressScreen }               from "./components/AddressScreen";
import { VendorLoadingScreen }         from "./components/VendorLoadingScreen";
import { VendorOptionsScreen }         from "./components/VendorOptionsScreen";
import { BookingVerificationScreen }   from "./components/BookingVerificationScreen";
import { PaymentScreen }               from "./components/PaymentScreen";
import { ServiceTrackingScreen }       from "./components/ServiceTrackingScreen";
import { VendorFeedbackScreen }        from "./components/VendorFeedbackScreen";
import { VendorCardOptions }           from "./components/VendorCardOptions";

// ── New screens ──────────────────────────────────────────────────
import { EditProfileScreen }           from "./components/EditProfileScreen";
import { SavedAddressesScreen }        from "./components/SavedAddressesScreen";
import { PaymentMethodsScreen }        from "./components/PaymentMethodsScreen";
import { NotificationSettingsScreen }  from "./components/NotificationSettingsScreen";
import { JobDetailScreen }             from "./components/JobDetailScreen";
import { RebookScreen }                from "./components/RebookScreen";
import { PromotionsScreen }            from "./components/PromotionsScreen";
import { VendorProfileScreen }         from "./components/VendorProfileScreen";
import { HelpScreen }                  from "./components/HelpScreen";
import { SupportChatScreen }           from "./components/SupportChatScreen";
import { FullMapScreen }               from "./components/FullMapScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true,    Component: SplashScreen },
      { path: "splash", Component: SplashScreen },
      { path: "onboarding", Component: OnboardingScreen },
      { path: "login",  Component: LoginScreen  },
      { path: "card-options", Component: VendorCardOptions },
      {
        path: "home",
        Component: HomeLayout,
        children: [
          // ── Tab screens ─────────────────────────────────────
          { index: true,           Component: HomeScreen          },
          { path: "services",      Component: ServicesScreen      },
          { path: "services/:id",  Component: ServiceDetailScreen },
          { path: "activity",      Component: ActivityScreen      },
          { path: "profile",       Component: ProfileScreen       },

          // ── Profile sub-pages ─────────────────────────────────
          { path: "profile/edit",          Component: EditProfileScreen        },
          { path: "profile/addresses",     Component: SavedAddressesScreen     },
          { path: "profile/payment",       Component: PaymentMethodsScreen     },
          { path: "profile/notifications", Component: NotificationSettingsScreen },

          // ── Chat entry ───────────────────────────────────────
          { path: "chat",              Component: ChatScreen             },
          { path: "chat/:serviceId",   Component: ChatConversationScreen },

          // ── Booking funnel ───────────────────────────────────
          { path: "address",           Component: AddressScreen          },
          { path: "loading",           Component: VendorLoadingScreen    },
          { path: "options",           Component: VendorOptionsScreen    },
          { path: "verification",      Component: BookingVerificationScreen },

          // ── Post-booking flow ────────────────────────────────
          { path: "payment",           Component: PaymentScreen          },
          { path: "tracking",          Component: ServiceTrackingScreen  },
          { path: "feedback",          Component: VendorFeedbackScreen   },

          // ── Activity detail & rebook ─────────────────────────
          { path: "activity/:jobId",   Component: JobDetailScreen        },
          { path: "rebook/:serviceId", Component: RebookScreen           },

          // ── Discovery & trust ────────────────────────────────
          { path: "promotions",              Component: PromotionsScreen      },
          { path: "vendor-profile/:serviceId", Component: VendorProfileScreen },

          // ── Help & support ───────────────────────────────────
          { path: "help",              Component: HelpScreen             },
          { path: "support",           Component: SupportChatScreen      },

          // ── Search & map ─────────────────────────────────────
          { path: "map",               Component: FullMapScreen          },
        ],
      },

      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);