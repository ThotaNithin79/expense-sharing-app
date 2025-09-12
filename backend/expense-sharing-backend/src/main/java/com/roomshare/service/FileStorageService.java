package com.roomshare.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    // The directory where files will be stored.
    private static final String UPLOAD_DIR = "uploads";

    public FileStorageService() {
        // 1. Define the root path for our uploads directory.
        // Paths.get(UPLOAD_DIR) creates a path relative to the project's root.
        this.fileStorageLocation = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();

        // 2. Create the directory if it doesn't exist.
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        // 3. Get the original filename from the uploaded file.
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            // 4. Check for invalid characters in the filename.
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + originalFileName);
            }

            // 5. Generate a unique filename to prevent overwrites.
            // We append a UUID to the original name.
            String fileExtension = "";
            try {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            } catch (Exception e) {
                // handle case where file has no extension
            }
            String newFileName = UUID.randomUUID().toString() + fileExtension;

            // 6. Define the target path where the file will be saved.
            Path targetLocation = this.fileStorageLocation.resolve(newFileName);

            // 7. Copy the file's input stream to the target location.
            // StandardCopyOption.REPLACE_EXISTING ensures that if (by a rare chance) the UUID conflicts, it will be overwritten.
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // 8. Return the path to the stored file to be saved in the database.
            // We'll store a relative path like "uploads/filename.jpg".
            return Paths.get(UPLOAD_DIR, newFileName).toString();

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }
}