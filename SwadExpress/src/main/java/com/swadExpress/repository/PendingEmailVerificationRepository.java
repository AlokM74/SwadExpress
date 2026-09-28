package com.swadExpress.repository;

import com.swadExpress.entity.PendingEmailVerification;
import com.swadExpress.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PendingEmailVerificationRepository
        extends JpaRepository<PendingEmailVerification, Long> {

    PendingEmailVerification findByUser(User user);
}
