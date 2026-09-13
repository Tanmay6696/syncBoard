// package com.example.docworkspace.repository;

// import com.example.docworkspace.entity.User;
// import org.springframework.data.jpa.repository.JpaRepository;

// import java.util.Optional;

// public interface UserRepository extends JpaRepository<User, Integer> {

//     Optional<User> findByEmail(String email);

//     boolean existsByEmail(String email);
// }
package com.example.docworkspace.repository;

import com.example.docworkspace.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}