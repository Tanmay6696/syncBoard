package com.example.docworkspace.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class CurrentUser {

    /**
     * Returns the authenticated user's ID from the SecurityContext.
     * Throws if there is no authenticated user.
     */
    public static Long getId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new IllegalStateException("No authenticated user");
        }
        return Long.parseLong(auth.getPrincipal().toString());
    }
}