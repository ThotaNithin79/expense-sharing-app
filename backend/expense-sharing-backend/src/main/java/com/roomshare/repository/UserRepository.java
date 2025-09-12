package com.roomshare.repository;

import com.roomshare.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data JPA automatically creates the query from the method name.
    Optional<User> findByEmail(String email);

    // Spring Data JPA will automatically create the query "SELECT * FROM users WHERE reset_password_token = ?"
    Optional<User> findByResetPasswordToken(String token);

}