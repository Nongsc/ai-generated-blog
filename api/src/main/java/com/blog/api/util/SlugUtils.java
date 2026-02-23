package com.blog.api.util;

/**
 * Slug 生成工具类
 */
public class SlugUtils {

    private SlugUtils() {
        // 工具类不允许实例化
    }

    /**
     * 根据名称生成 Slug
     * 支持中文、英文、数字，其他字符替换为连字符
     *
     * @param name 名称
     * @return 生成的 Slug
     */
    public static String generateSlug(String name) {
        if (name == null || name.isBlank()) {
            return "";
        }
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\u4e00-\\u9fa5]+", "-")
                .replaceAll("^-|-$", "");
    }

    /**
     * 生成唯一的 Slug（如果冲突则添加时间戳后缀）
     *
     * @param slug         原始 Slug
     * @param existsChecker 检查 Slug 是否存在的函数
     * @return 唯一的 Slug
     */
    public static String generateUniqueSlug(String slug, java.util.function.Function<String, Boolean> existsChecker) {
        if (!existsChecker.apply(slug)) {
            return slug;
        }
        return slug + "-" + System.currentTimeMillis();
    }
}
