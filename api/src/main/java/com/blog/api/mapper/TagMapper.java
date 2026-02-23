package com.blog.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.blog.api.entity.Tag;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TagMapper extends BaseMapper<Tag> {
}
