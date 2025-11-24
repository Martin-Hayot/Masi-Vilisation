import { useMemo } from "react";
import { NavLink, useLocation, useMatches } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

// Map of route segments to readable labels
const segmentLabels: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Users",
  settings: "Settings",
  profile: "Profile",
  analytics: "Analytics",
  reports: "Reports",
  // Add more mappings as needed
};

// Function to convert segment to readable label
const getSegmentLabel = (segment: string): string => {
  // Check if there's a custom label
  if (segmentLabels[segment]) {
    return segmentLabels[segment];
  }

  // Convert kebab-case or snake_case to Title Case
  return segment
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

interface BreadcrumbSegment {
  label: string;
  path: string;
  isLast: boolean;
}

export function DynamicBreadcrumbs() {
  const location = useLocation();
  const matches = useMatches();

  const breadcrumbs = useMemo(() => {
    const pathname = location.pathname;

    // Split pathname and filter empty segments
    const segments = pathname.split("/").filter(Boolean);

    // If we're at root, return empty array
    if (segments.length === 0) {
      return [];
    }

    // Build breadcrumb segments (no home segment)
    const breadcrumbSegments: BreadcrumbSegment[] = [];

    // Build cumulative paths and create breadcrumb items
    segments.forEach((segment, index) => {
      const path = "/" + segments.slice(0, index + 1).join("/");
      const isLast = index === segments.length - 1;

      // Try to get a custom label from route handle
      let label = getSegmentLabel(segment);

      // Check if the route has a handle with a breadcrumb or title
      const matchedRoute = matches.find((match) => match.pathname === path);
      if (matchedRoute?.handle) {
        const handle = matchedRoute.handle as any;
        label = handle.breadcrumb || handle.title || label;
      }

      breadcrumbSegments.push({
        label,
        path,
        isLast,
      });
    });

    return breadcrumbSegments;
  }, [location.pathname, matches]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.path} className="flex items-center gap-1.5">
            <BreadcrumbItem>
              {breadcrumb.isLast ? (
                <BreadcrumbPage>
                  {index === 0 ? (
                    <div className="flex items-center gap-1.5">
                      <Home className="h-4 w-4" />
                      <span>{breadcrumb.label}</span>
                    </div>
                  ) : (
                    breadcrumb.label
                  )}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <NavLink to={breadcrumb.path}>
                    {index === 0 ? (
                      <div className="flex items-center gap-1.5">
                        <Home className="h-4 w-4" />
                        <span>{breadcrumb.label}</span>
                      </div>
                    ) : (
                      breadcrumb.label
                    )}
                  </NavLink>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!breadcrumb.isLast && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
