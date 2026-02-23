---
id: "typescript-advanced-tips"
title: "TypeScript 高级技巧：让你的代码更加类型安全"
date: "2025-02-15"
categories:
  - "技术分享"
  - "学习笔记"
tags:
  - "TypeScript"
  - "React"
cover: "/images/177118-dong_hua_pian-lan_guang_guang_pan-tao-dvd-fa_xing-3840x2160.jpg"
excerpt: "掌握这些 TypeScript 高级技巧，让你的代码更加健壮，开发体验更加出色。"
---

# TypeScript 高级技巧

TypeScript 为 JavaScript 添加了强大的类型系统，本文将介绍一些高级技巧来提升你的类型安全性。

## 泛型约束

使用泛型约束可以更精确地控制类型：

```typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): void {
  console.log(item.length);
}

// 正确
logLength("hello"); // 5
logLength([1, 2, 3]); // 3

// 错误：number 类型没有 length 属性
// logLength(123);
```

## 条件类型

条件类型允许根据类型关系进行条件判断：

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
```

## 映射类型

映射类型可以基于现有类型创建新类型：

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
// { readonly name: string; readonly age: number; }
```

## 实用工具类型

TypeScript 内置了许多实用工具类型：

```typescript
// Partial - 将所有属性变为可选
type PartialUser = Partial<User>;

// Pick - 选择特定属性
type UserName = Pick<User, 'name'>;

// Omit - 排除特定属性
type UserWithoutAge = Omit<User, 'age'>;

// Record - 创建对象类型
type UserMap = Record<string, User>;
```

## 在 React 中使用

结合 React 使用 TypeScript 的最佳实践：

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size = 'md',
  children,
  onClick
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

## 总结

掌握 TypeScript 的高级技巧可以大大提升代码质量和开发效率。持续学习和实践是成为 TypeScript 高手的关键。
