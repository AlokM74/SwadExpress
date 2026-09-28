package com.swadExpress.repository;

import com.swadExpress.entity.PendingPasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PendingPasswordResetRepository extends JpaRepository<PendingPasswordReset, Long> {

    PendingPasswordReset findByEmail(String email);
}
