package com.swadExpress.repository;

import com.swadExpress.entity.PendingRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PendingRegistrationRepository extends JpaRepository<PendingRegistration, Long> {

    PendingRegistration findByEmail(String email);
}
